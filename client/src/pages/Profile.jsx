import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
    const [user, setUser] = useState(null);
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
            const response = await fetch(`/api/users/profile?userId=${currentUser.id}`);
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.log(error);
        }
    };

    // Define theme colors based on dark mode state
    const colors = {
        bg: darkMode ? '#1A1A1A' : '#F5F3EE',
        border: darkMode ? '#333333' : '#E2DFD6',
        text: darkMode ? '#E8E6E1' : '#1A1A1A',
        secondaryText: darkMode ? '#A9A295' : '#6D6459',
        accent: darkMode ? '#C9AD6A' : '#9B8759',
        cardBg: darkMode ? '#2A2A2A' : '#FCFAF6',
        statsBg: darkMode ? '#333333' : '#F9F7F2',
        btnBg: darkMode ? '#3E3D39' : '#3E3D39',
        btnText: darkMode ? '#FCFAF6' : '#FCFAF6',
        btnHoverBg: darkMode ? '#2A2A28' : '#2A2A28',
        divider: darkMode ? '#444444' : '#D5C7A9',
        placeholderBg: darkMode ? '#2A2A2A' : '#F5F3EE',
        loadingText: darkMode ? '#A9A295' : '#6D6459'
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen font-serif" style={{ backgroundColor: colors.bg }}>
                <div className="italic tracking-wide" style={{ color: colors.loadingText }}>Loading profile information...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-serif py-12 px-6" style={{ backgroundColor: colors.bg, color: colors.text }}>
            <div className="max-w-sm mx-auto">
                <h1 className="text-3xl font-bold text-center mb-10 tracking-tight" style={{ color: colors.text }}>
                    <span style={{ borderBottom: `2px solid ${colors.accent}`, paddingBottom: '0.5rem' }}>Profile</span>
                </h1>
                
                <div className="rounded-sm shadow-sm p-6" style={{ 
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    border: `1px solid ${colors.border}`
                }}>
                    {/* Profile Header */}
                    <div className="flex flex-col items-center">
                        {/* Profile Image with decorative border */}
                        <div className="relative mb-5">
                            <div className="w-24 h-24 absolute rounded-full transform rotate-3" style={{ 
                                borderColor: colors.accent,
                                border: `1px solid ${colors.accent}`
                            }}></div>
                            {user.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover relative z-10"
                                    style={{ 
                                        borderColor: colors.accent,
                                        border: `2px solid ${colors.accent}`
                                    }}
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-medium relative z-10" style={{ 
                                    backgroundColor: colors.placeholderBg,
                                    borderColor: colors.accent,
                                    border: `2px solid ${colors.accent}`,
                                    color: colors.accent
                                }}>
                                    {user.name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>

                        {/* User Name and Email */}
                        <h2 className="text-xl font-bold tracking-wide" style={{ color: colors.text }}>{user.name}</h2>
                        <p className="text-sm mt-1 font-light tracking-wide" style={{ color: colors.secondaryText }}>{user.email}</p>
                        
                        {/* Decorative divider */}
                        <div className="w-12 h-px my-4" style={{ backgroundColor: colors.divider }}></div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-4 text-center" style={{ 
                            backgroundColor: colors.statsBg,
                            borderColor: colors.border,
                            border: `1px solid ${colors.border}`
                        }}>
                            <div className="text-2xl font-medium" style={{ color: colors.text }}>{user.followers.length || 0}</div>
                            <div className="text-xs uppercase tracking-wider" style={{ color: colors.secondaryText }}>Followers</div>
                        </div>
                        <div className="p-4 text-center" style={{ 
                            backgroundColor: colors.statsBg,
                            borderColor: colors.border,
                            border: `1px solid ${colors.border}`
                        }}>
                            <div className="text-2xl font-medium" style={{ color: colors.text }}>{user.following.length || 0}</div>
                            <div className="text-xs uppercase tracking-wider" style={{ color: colors.secondaryText }}>Following</div>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <div className="flex justify-center mt-4">
                        <button className="px-6 py-2 text-xs uppercase tracking-wider font-medium transition-colors" style={{ 
                            backgroundColor: colors.btnBg,
                            borderColor: colors.btnBg,
                            border: `1px solid ${colors.btnBg}`,
                            color: colors.btnText,
                            ":hover": { backgroundColor: colors.btnHoverBg }
                        }}>
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;