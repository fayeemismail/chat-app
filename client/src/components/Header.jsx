import React, { useState, useEffect } from "react";
import { FaSearch, FaUserCircle, FaSignOutAlt, FaBell, FaCompass, FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/authSlice";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Close the dropdown when the location changes (i.e., when navigating)
    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location]); // Dependency on location to reset dropdown state

    const homePage = () => navigate('/');
    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/sign-in');
    };
    const handleProfile = () => navigate('/profile');
    const handleExplore = () => navigate('/explore');
    const handleNotifications = () => navigate('/notifications');
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <header className="flex items-center justify-between bg-gray-900 text-white p-4 z-50 shadow-md relative">
            {/* App Name */}
            <h1 className="text-xl font-bold cursor-pointer" onClick={homePage}>
                Blah Blah
            </h1>

            {/* Search Bar */}
            <div className="flex items-center bg-gray-800 px-3 py-1 rounded-md">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent focus:outline-none text-white placeholder-gray-400"
                />
            </div>

            {/* Icons Section */}
            <div className="flex items-center gap-4">
                {/* Explore */}
                <FaCompass className="text-2xl cursor-pointer hover:text-gray-400" onClick={handleExplore} />

                {/* Notifications */}
                <div className="relative">
                    <FaBell className="text-2xl cursor-pointer hover:text-gray-400" onClick={handleNotifications} />
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <FaUserCircle
                        className="text-2xl cursor-pointer hover:text-gray-400"
                        onClick={toggleDropdown}
                    />
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded-md shadow-md">
                            <button
                                className="w-full flex items-center px-4 py-2 hover:bg-gray-200"
                                onClick={handleProfile}
                            >
                                <FaUser className="mr-2" /> Profile
                            </button>
                            <button
                                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-200"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="mr-2" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
