import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

const Socket = io.connect('http://localhost:3001', {
    autoConnect: false,
});

const Home = () => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/sign-in');
            return;
        }

        Socket.auth = { userId: user.id };
        Socket.connect();

        Socket.on('socket_id', (socketId) => {
            localStorage.setItem('socketId', socketId);
        });

        fetchRooms();

        return () => {
            Socket.disconnect();
        };
    }, [user, navigate]);

    const fetchRooms = async () => {
        try {
            const roomsRes = await fetch(`api/users/findRoom?userId=${user.id}`);
            const roomsData = await roomsRes.json();

            if (Array.isArray(roomsData)) {
                setRooms(roomsData);
            } else {
                console.error("Unexpected response format:", roomsData);
                setRooms([]);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setRooms([]);
        }
    };

    const joinRoom = (roomId) => {
        if (roomId) {
            Socket.emit('join_room', roomId);
            navigate(`/chat/${roomId}`);
        }
    };

    const createRoom = () => {
        Swal.fire({
            title: 'Enter Room Name',
            input: 'text',
            inputPlaceholder: 'Room Name',
            showCancelButton: true,
            confirmButtonText: 'Create Room',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a room name!';
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed && result.value.trim()) {
                try {
                    const res = await fetch('api/users/create-room', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id, name: result.value }),
                    });
                    const data = await res.json();
                    if (data.message) {
                        fetchRooms(); // Fetch updated rooms instead of adding manually
                        Swal.fire('Success', data.message, 'success');
                    } else if (data.error) {
                        Swal.fire('Error', data.error, 'error');
                    }
                } catch (error) {
                    console.error('Error creating room:', error);
                    Swal.fire('Error', 'Failed to create room!', 'error');
                }
            }
        });
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg p-4 bg-gray-100 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Available Rooms</h2>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={createRoom}
                    >
                        + Create Room
                    </button>
                </div>
                <ul>
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <li key={room?._id || Math.random()} className="p-2 border-b border-gray-300 flex justify-between items-center">
                                <span>{room?.name || "Unknown Room"}</span>
                                <button
                                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                    onClick={() => room?._id && joinRoom(room._id)}
                                >
                                    Join
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No rooms available</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Home;
