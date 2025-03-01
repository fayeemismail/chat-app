import React, { useState } from 'react'
import { io } from 'socket.io-client';
import Chat from './Chat';

const Socket = io.connect('http://localhost:3001')

const Home = () => {

    const [userName, setUserName] = useState('');
    const [room, setRoom] = useState('');
    const [showChat, setShowChat] = useState(false)

    const joinRoom = () => {
        if (userName !== "" && room !== '') {
            Socket.emit('join_room', room)
            setShowChat(true)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center mt-45 gap-4 p-6 bg-gray-100 rounded-lg shadow-lg w-96 mx-auto">

            {!showChat ? (
                <div className="flex flex-col w-full gap-4">
                    <h1 className="text-xl font-bold text-gray-700">Join A Chat</h1>

                    <input
                        type="text"
                        placeholder="Enter your name..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Enter Room ID..."
                        onChange={(e) => setRoom(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={joinRoom}
                        className="w-full p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
                    >
                        Join Room
                    </button>
                </div>
            ) : (
                <Chat socket={Socket} userName={userName} room={room} />
            )}

        </div>

    )
}

export default Home