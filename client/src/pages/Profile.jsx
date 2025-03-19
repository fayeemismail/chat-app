import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

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

    if (currentUser) {
      fetchUserData();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [currentUser, darkMode]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `/api/users/profile?userId=${currentUser.id}`
      );
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProfile = async () => {
    try {
      navigate('/editProfile');
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen font-serif ${
          darkMode
            ? 'bg-[#1A1A1A] text-[#A9A295]'
            : 'bg-[#F5F3EE] text-[#6D6459]'
        }`}
      >
        <div className="italic tracking-wide">
          Loading profile information...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-serif py-12 px-6 ${
        darkMode ? 'bg-[#1A1A1A] text-[#E8E6E1]' : 'bg-[#F5F3EE] text-[#1A1A1A]'
      }`}
    >
      <div className="max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 tracking-tight">
          <span
            className={`border-b-2 pb-2 ${
              darkMode ? 'border-[#C9AD6A]' : 'border-[#9B8759]'
            }`}
          >
            Profile
          </span>
        </h1>

        <div
          className={`rounded-sm shadow-sm p-6 ${
            darkMode
              ? 'bg-[#2A2A2A] border border-[#333333]'
              : 'bg-[#FCFAF6] border border-[#E2DFD6]'
          }`}
        >
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            {/* Profile Image with decorative border */}
            <div className="relative mb-5">
              <div
                className={`w-24 h-24 absolute rounded-full transform rotate-3 ${
                  darkMode
                    ? 'border border-[#C9AD6A]'
                    : 'border border-[#9B8759]'
                }`}
              ></div>
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className={`w-24 h-24 rounded-full object-cover relative z-10 ${
                    darkMode
                      ? 'border-2 border-[#C9AD6A]'
                      : 'border-2 border-[#9B8759]'
                  }`}
                />
              ) : (
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-medium relative z-10 ${
                    darkMode
                      ? 'bg-[#2A2A2A] border-2 border-[#C9AD6A] text-[#C9AD6A]'
                      : 'bg-[#F5F3EE] border-2 border-[#9B8759] text-[#9B8759]'
                  }`}
                >
                  {user.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            {/* User Name and Email */}
            <h2 className="text-xl font-bold tracking-wide">{user.name}</h2>

            {/* Decorative divider */}
            <div
              className={`w-12 h-px my-4 ${
                darkMode ? 'bg-[#444444]' : 'bg-[#D5C7A9]'
              }`}
            ></div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div
              className={`p-4 text-center ${
                darkMode
                  ? 'bg-[#333333] border border-[#333333]'
                  : 'bg-[#F9F7F2] border border-[#E2DFD6]'
              }`}
              onClick={()=> navigate(`/profile/${currentUser.id}/connections?tab=followers`)}
            >
              <div className="text-2xl font-medium">
                {user.followers.length || 0}
              </div>
              <div
                className={`text-xs uppercase tracking-wider ${
                  darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'
                }`}
              >
                Followers
              </div>
            </div>
            <div
              className={`p-4 text-center ${
                darkMode
                  ? 'bg-[#333333] border border-[#333333]'
                  : 'bg-[#F9F7F2] border border-[#E2DFD6]'
              }`}
              onClick={()=> navigate(`/profile/${currentUser.id}/connections?tab=following`)}
            >
              <div className="text-2xl font-medium">
                {user.following.length || 0}
              </div>
              <div
                className={`text-xs uppercase tracking-wider ${
                  darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'
                }`}
              >
                Following
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-center mt-4">
            <button
              className={`px-6 py-2 text-xs uppercase tracking-wider font-medium transition-colors 
                            bg-[#3E3D39] text-[#FCFAF6] hover:bg-[#242422]`}
              onClick={() => handleEditProfile()}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
