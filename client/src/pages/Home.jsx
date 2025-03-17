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

  // Initialize darkMode state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });

  useEffect(() => {
    // Listen for changes to localStorage from other components
    const handleStorageChange = (e) => {
      if (e.key === 'darkMode') {
        setDarkMode(e.newValue === 'true');
      }
    };

    // Also check if darkMode value changes while component is mounted
    const checkDarkMode = () => {
      const currentSetting = localStorage.getItem('darkMode') === 'true';
      if (currentSetting !== darkMode) {
        setDarkMode(currentSetting);
      }
    };

    // Check periodically for changes (since storage event doesn't fire in same window)
    const intervalId = setInterval(checkDarkMode, 500);
    window.addEventListener('storage', handleStorageChange);

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
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [user, navigate, darkMode]);

  const fetchRooms = async () => {
    try {
      const roomsRes = await fetch(`api/users/findRoom?userId=${user.id}`);
      const roomsData = await roomsRes.json();

      if (Array.isArray(roomsData)) {
        setRooms(roomsData);
      } else {
        console.error('Unexpected response format:', roomsData);
        setRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
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
    // Apply dark mode to SweetAlert based on current theme
    Swal.fire({
      title: 'Enter Room Name',
      input: 'text',
      inputPlaceholder: 'Room Name',
      showCancelButton: true,
      confirmButtonText: 'Create Room',
      cancelButtonText: 'Cancel',
      background: darkMode ? '#2A2A2A' : '#FCFAF6',
      color: darkMode ? '#E8E6E1' : '#1A1A1A',
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
            fetchRooms();
            Swal.fire({
              title: 'Success',
              text: data.message,
              icon: 'success',
              background: darkMode ? '#2A2A2A' : '#FCFAF6',
              color: darkMode ? '#E8E6E1' : '#1A1A1A',
            });
          } else if (data.error) {
            Swal.fire({
              title: 'Error',
              text: data.error,
              icon: 'error',
              background: darkMode ? '#2A2A2A' : '#FCFAF6',
              color: darkMode ? '#E8E6E1' : '#1A1A1A',
            });
          }
        } catch (error) {
          console.error('Error creating room:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to create room!',
            icon: 'error',
            background: darkMode ? '#2A2A2A' : '#FCFAF6',
            color: darkMode ? '#E8E6E1' : '#1A1A1A',
          });
        }
      }
    });
  };

  // Define theme colors based on dark mode state (same as in Header)
  const colors = {
    bg: darkMode ? '#1A1A1A' : '#F5F3EE',
    border: darkMode ? '#333333' : '#E2DFD6',
    text: darkMode ? '#E8E6E1' : '#1A1A1A',
    secondaryText: darkMode ? '#A9A295' : '#6D6459',
    accent: darkMode ? '#C9AD6A' : '#9B8759',
    inputBg: darkMode ? '#2A2A2A' : '#FCFAF6',
    dropdownBg: darkMode ? '#2A2A2A' : '#FCFAF6',
    hoverBg: darkMode ? '#333333' : '#F5F3EE',
    btnBg: darkMode ? '#3E3D39' : '#3E3D39',
    btnText: darkMode ? '#FCFAF6' : '#FCFAF6',
    btnHoverBg: darkMode ? '#2A2A28' : '#2A2A28',
  };

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        minHeight: '100vh',
      }}
      className="font-serif py-12 px-6"
    >
      <div className="max-w-lg mx-auto">
        <h1
          className="text-4xl font-bold text-center mb-12 tracking-tight"
          style={{ color: colors.text }}
        >
          <span
            style={{
              borderBottom: `2px solid ${colors.accent}`,
              paddingBottom: '0.5rem',
            }}
          >
            Conversations
          </span>
        </h1>

        <div
          style={{
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
          className="border rounded-sm p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-xl font-medium tracking-wide"
              style={{ color: colors.text }}
            >
              Available Rooms
            </h2>
            <button
              style={{
                backgroundColor: colors.btnBg,
                borderColor: colors.btnBg,
                color: colors.btnText,
              }}
              className="px-5 py-2 border text-xs uppercase tracking-wider font-medium rounded-sm transition-colors hover:bg-[#2A2A28]"
              onClick={createRoom}
            >
              Create Room
            </button>
          </div>

          {rooms.length > 0 ? (
            <ul style={{ borderColor: colors.border }} className="divide-y">
              {rooms.map((room) => (
                <li
                  key={room?._id || Math.random()}
                  className="py-4 flex justify-between items-center transition-colors px-2 hover:bg-opacity-20"
                  style={{
                    borderColor: colors.border,
                    ':hover': { backgroundColor: colors.hoverBg },
                  }}
                >
                  <span style={{ color: colors.text }} className="font-medium">
                    {room?.name || 'Unknown Room'}
                  </span>
                  <button
                    style={{
                      borderColor: colors.accent,
                      color: colors.accent,
                    }}
                    className="px-5 py-2 border text-xs uppercase tracking-wider font-medium rounded-sm transition-colors hover:bg-opacity-20"
                    onClick={() => room?._id && joinRoom(room._id)}
                  >
                    Enter
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 text-center">
              <p style={{ color: colors.secondaryText }} className="italic">
                No conversations available
              </p>
              <p style={{ color: colors.accent }} className="text-sm mt-2">
                Create a room to begin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
