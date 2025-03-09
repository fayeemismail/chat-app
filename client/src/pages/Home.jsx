import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Socket = io.connect('http://localhost:3001', {
  autoConnect: false,
});

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState('');

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

    fetchUsersAndRooms();

    return () => {
      Socket.disconnect();
    };
  }, [user, navigate]);

  const fetchUsersAndRooms = async () => {
    try {
      const usersRes = await fetch(`api/users/findUser?userId=${user.id}`);
      const roomsRes = await fetch(`api/users/findRoom?userId=${user.id}`);
      const usersData = await usersRes.json();
      console.log(usersData)
      const roomsData = await roomsRes.json();
      setUsers(usersData);
      setRooms(roomsData);
    } catch (error) {
      console.log(error);
    }
  };

  const joinRoom = (roomId) => {
    if (roomId) {
      Socket.emit('join_room', roomId);
      navigate(`/chat/${roomId}`);
    }
  };

  const createRoom = async () => {
    try {
      const res = await fetch('http://localhost:3001/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: `Room-${Date.now()}` }),
      });
      const data = await res.json();
      setRooms([...rooms, data]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen p-4" style={{scrollbars: "none"}}>
      {/* Users Container */}
      <div className="w-1/2 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Available Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} className="p-2 border-b border-gray-300">
              {user.name} 
            </li>
          ))}
        </ul>
      </div>
      
      {/* Rooms Container */}
      <div className="w-1/2 p-4 bg-gray-100 rounded-lg shadow-md ml-4 relative">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Available Rooms</h2>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={createRoom}
          >
            + Create Room
          </button>
        </div>
        <ul>
          {rooms.map((room) => (
            <li 
              key={room._id} 
              className="p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-200"
              onClick={() => joinRoom(room._id)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
