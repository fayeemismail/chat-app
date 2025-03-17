import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
  FaCompass,
  FaUser,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize darkMode state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    // Apply dark mode to document body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Save to localStorage whenever darkMode changes
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const homePage = () => navigate('/');
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/sign-in');
  };
  const handleProfile = () => navigate('/profile');
  const handleExplore = () => navigate('/explore');
  const handleNotifications = () => navigate('/notifications');
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Define theme colors based on dark mode state
  const colors = {
    bg: darkMode ? '#1A1A1A' : '#F5F3EE',
    border: darkMode ? '#333333' : '#E2DFD6',
    text: darkMode ? '#E8E6E1' : '#1A1A1A',
    secondaryText: darkMode ? '#A9A295' : '#6D6459',
    accent: darkMode ? '#C9AD6A' : '#9B8759',
    inputBg: darkMode ? '#2A2A2A' : '#FCFAF6',
    dropdownBg: darkMode ? '#2A2A2A' : '#FCFAF6',
    hoverBg: darkMode ? '#333333' : '#F5F3EE',
    iconColor: darkMode ? '#A9A295' : '#3E3D39',
    iconHover: darkMode ? '#C9AD6A' : '#9B8759',
  };

  return (
    <header
      className={`border-b shadow-sm relative z-50 font-serif p-4`}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* App Name */}
        <h1
          className="text-2xl font-bold cursor-pointer tracking-tight"
          onClick={homePage}
          style={{ color: colors.text }}
        >
          <span style={{ borderBottom: `1px solid ${colors.accent}` }}>
            Blah Blah
          </span>
        </h1>

        {/* Search Bar */}
        <div
          className="flex items-center px-4 py-2 rounded-sm shadow-sm w-1/3"
          style={{
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            border: `1px solid ${colors.border}`,
          }}
        >
          <FaSearch style={{ color: colors.accent }} className="mr-3" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full"
            style={{
              color: colors.text,
              '::placeholder': { color: colors.secondaryText },
            }}
          />
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-6">
          {/* Dark Mode Toggle */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <FaSun
                className="text-xl transition-colors"
                style={{ color: colors.iconColor, hover: colors.iconHover }}
              />
            ) : (
              <FaMoon
                className="text-xl transition-colors"
                style={{ color: colors.iconColor, hover: colors.iconHover }}
              />
            )}
            <span
              className="text-xs mt-1"
              style={{ color: colors.secondaryText }}
            >
              {darkMode ? 'Light' : 'Dark'}
            </span>
          </div>

          {/* Explore */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleExplore}
          >
            <FaCompass
              className="text-xl transition-colors"
              style={{ color: colors.iconColor }}
            />
            <span
              className="text-xs mt-1"
              style={{ color: colors.secondaryText }}
            >
              Explore
            </span>
          </div>

          {/* Notifications */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleNotifications}
          >
            <div className="relative">
              <FaBell
                className="text-xl transition-colors"
                style={{ color: colors.iconColor }}
              />
            </div>
            <span
              className="text-xs mt-1"
              style={{ color: colors.secondaryText }}
            >
              Alerts
            </span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <FaUserCircle
                className="text-xl transition-colors"
                style={{ color: colors.iconColor }}
              />
              <span
                className="text-xs mt-1"
                style={{ color: colors.secondaryText }}
              >
                Account
              </span>
            </div>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-sm shadow-md"
                style={{
                  backgroundColor: colors.dropdownBg,
                  borderColor: colors.border,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <button
                  className="w-full flex items-center px-4 py-3 text-sm font-medium tracking-wide"
                  onClick={handleProfile}
                  style={{
                    color: colors.text,
                    ':hover': { backgroundColor: colors.hoverBg },
                  }}
                >
                  <FaUser className="mr-3" style={{ color: colors.accent }} />{' '}
                  View Profile
                </button>
                <div style={{ borderTop: `1px solid ${colors.border}` }}></div>
                <button
                  className="w-full flex items-center px-4 py-3 text-sm font-medium tracking-wide"
                  onClick={handleLogout}
                  style={{
                    color: colors.text,
                    ':hover': { backgroundColor: colors.hoverBg },
                  }}
                >
                  <FaSignOutAlt
                    className="mr-3"
                    style={{ color: colors.accent }}
                  />{' '}
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
