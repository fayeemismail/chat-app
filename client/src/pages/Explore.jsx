import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState({});
  const currentUser = useSelector((state) => state.auth.user);

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

    const fetchUsersAndFollowStatus = async () => {
      try {
        // Fetch users
        const userRes = await axios.get(
          `/api/users/explore/?userId=${currentUser.id}`
        );
        setUsers(userRes.data);

        // Fetch following status
        const followRes = await axios.get(
          `/api/users/following/?userId=${currentUser.id}`
        );

        // Convert response to an object { userId: "Following" or "Requested" }
        const followStatus = {};
        followRes.data.forEach((user) => {
          followStatus[user._id] = user.status; // "Following" or "Requested"
        });

        setFollowing(followStatus);
      } catch (error) {
        console.error('Error fetching users or follow status', error);
      }
    };

    fetchUsersAndFollowStatus();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [currentUser.id, darkMode]);

  const handleFollow = async (userId, isPrivate) => {
    try {
      // Prevent duplicate request updates
      if (following[userId] === 'Requested') return;

      setFollowing((prev) => ({
        ...prev,
        [userId]: isPrivate ? 'Requested' : 'Following',
      }));

      await axios.post('/api/users/sendFollow', {
        targetUserId: userId,
        currentUserId: currentUser.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Define theme colors based on dark mode state (same as in Header and Home)
  const colors = {
    bg: darkMode ? '#1A1A1A' : '#F5F3EE',
    border: darkMode ? '#333333' : '#E2DFD6',
    text: darkMode ? '#E8E6E1' : '#1A1A1A',
    secondaryText: darkMode ? '#A9A295' : '#6D6459',
    accent: darkMode ? '#C9AD6A' : '#9B8759',
    cardBg: darkMode ? '#2A2A2A' : '#FCFAF6',
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
      className="font-serif"
    >
      <div className="max-w-5xl mx-auto p-8">
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
            Discover Community
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <div
              key={user._id}
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              }}
              className="p-6 rounded-md hover:shadow-md transition-all border flex flex-col items-center"
            >
              <div className="w-20 h-20 mb-4 relative">
                <div
                  className="absolute inset-0 rounded-full border-2 transform -rotate-3"
                  style={{ borderColor: colors.accent }}
                ></div>
                {user.profilePhoto ? 
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-full h-full rounded-full border-2 object-cover shadow-sm"
                  style={{ borderColor: colors.accent }}
                /> : <div
                className={`w-full h-full flex items-center bg-[#2A2A2A] justify-center rounded-full border-2 shadow-sm text-white font-bold text-2xl ${darkMode
                  ? 'bg-[#2A2A2A] border-2 border-[#C9AD6A] text-[#C9AD6A]'
                  : 'bg-[#F5F3EE] border-2 border-[#9B8759] text-[#9B8759]'
              }}`}
                style={{ borderColor: colors.accent, backgroundColor: '#2A2A2A' }} // Set a background color
              >
                {user.name?.charAt(0) || "U"}
              </div>
              
                
              }



              </div>

              <div className="text-center w-full">
                <h2
                  className="text-lg font-bold tracking-wide"
                  style={{ color: colors.text }}
                >
                  {user.name}
                </h2>
                <p
                  className="text-sm mt-1 font-light"
                  style={{ color: colors.secondaryText }}
                >
                  {user.followers?.length || 0}{' '}
                  {user.followers?.length === 1 ? 'Follower' : 'Followers'}
                </p>

                <div className="mt-4 w-full flex justify-center">
                  <button
                    onClick={() => handleFollow(user._id, user.isPrivate)}
                    className={`
                                            py-2 px-6 text-xs tracking-wider uppercase
                                            border rounded-sm font-medium transition-all
                                        `}
                    style={
                      following[user._id]
                        ? {
                            borderColor: colors.accent,
                            color: colors.accent,
                            backgroundColor: 'transparent',
                          }
                        : {
                            borderColor: colors.btnBg,
                            color: colors.btnText,
                            backgroundColor: colors.btnBg,
                          }
                    }
                  >
                    {following[user._id] || 'Follow'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
