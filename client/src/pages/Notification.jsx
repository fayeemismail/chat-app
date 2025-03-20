import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash, FaBox } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Notifications = () => {
  const userId = useSelector((state) => state.auth.user.id);
  const [notifications, setNotifications] = useState([]);
  const [following, setFollowing] = useState({});
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `/api/users/notifications/?userId=${userId}`
        );
        setNotifications(response.data);

        // Fetch following status
        const followRes = await axios.get(
          `/api/users/following/?userId=${userId}`
        );

        // Convert response to an object { userId: "Following" or "Requested" }
        const followStatus = {};
        followRes.data.forEach((user) => {
          followStatus[user._id] = user.status; // "Following" or "Requested"
        });

        setFollowing(followStatus);
      } catch (error) {
        console.log('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    const handleStorageChange = (e) => {
      if (e.key === 'darkMode') {
        setDarkMode(e.newValue === 'true');
      }
    };

    const checkDarkMode = () => {
      const currentSetting = localStorage.getItem('darkMode') === 'true';
      if (currentSetting !== darkMode) {
        setDarkMode(currentSetting);
      }
    };

    const intervalId = setInterval(checkDarkMode, 100);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [darkMode, userId]);

  const colors = {
    bg: darkMode ? '#1A1A1A' : '#F5F3EE',
    border: darkMode ? '#333333' : '#E2DFD6',
    text: darkMode ? '#E8E6E1' : '#1A1A1A',
    secondaryText: darkMode ? '#A9A295' : '#6D6459',
    accent: darkMode ? '#C9AD6A' : '#9B8759',
    inputBg: darkMode ? '#2A2A2A' : '#FCFAF6',
    cardBg: darkMode ? '#2A2A2A' : '#FCFAF6',
    hoverBg: darkMode ? '#333333' : '#F5F3EE',
    unreadBg: darkMode ? '#3A3A3A' : '#FAF7F1',
  };

  const followBack = async (id, isPrivate) => {
    try {
      if (following[userId] === 'Requested') return;

      setFollowing((prev) => ({
        ...prev,
        [userId]: isPrivate ? 'Requested' : 'Following',
      }));

      await axios.post('/api/users/sendFollow', {
        targetUserId: id,
        currentUserId: userId,
      });
    } catch (error) {
      console.log('Error marking notification as read:', error);
    }
  };

  const acceptRequest = async (targetId, notificationId) => {
    try {
      console.log(targetId, notificationId);
      await axios.post('/api/users/accept_request', {
        userId: userId,
        targetId: targetId,
        notificationId: notificationId,
      });
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));

        // ✅ Update following state instantly
        setFollowing((prev) => ({
            ...prev,
            [targetId]: "Following",
        }));
    } catch (error) {
      console.log(error);
    }
  };

  // Button style with small border
  const buttonStyle = {
    color: colors.accent,
    border: `1px solid ${colors.accent}`,
    borderRadius: '4px',
    padding: '0.35rem 0.75rem',
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent',
  };

  const buttonHoverStyle = {
    backgroundColor: colors.accent,
    color: colors.cardBg,
  };

  return (
    <div
      className="min-h-screen font-serif"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <FaBell className="text-2xl mr-3" style={{ color: colors.accent }} />
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
            Notifications
          </h1>
        </div>

        {notifications.length === 0 ? (
          <div
            className="text-center py-10 rounded-sm"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
              border: `1px solid ${colors.border}`,
              color: colors.secondaryText,
            }}
          >
            No notifications yet.
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="mb-4 p-4 rounded-sm shadow-sm flex justify-between items-center"
                style={{
                  backgroundColor: notification.read
                    ? colors.cardBg
                    : colors.unreadBg,
                  borderColor: colors.border,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div>
                  <p className="mb-1" style={{ color: colors.text }}>
                    {notification.type === 'follow_request'
                      ?  `${notification.sender.name} Wants to follow you`
                      : notification.message}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: colors.secondaryText }}
                  >
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {notification.type == 'follow_request' ? (
                    <button
                      className="hover:opacity-90 transition-opacity"
                      onClick={() =>
                        acceptRequest(notification.sender._id, notification._id)
                      }
                      style={buttonStyle}
                      onMouseOver={(e) => {
                        Object.assign(e.currentTarget.style, buttonHoverStyle);
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.accent;
                      }}
                    >
                      Accept
                    </button>
                  ) : notification.sender.followers.includes(userId) &&
                    notification.sender.following.includes(userId) ? (
                    <button
                      className="hover:opacity-90 transition-opacity"
                      style={buttonStyle}
                      onMouseOver={(e) => {
                        Object.assign(e.currentTarget.style, buttonHoverStyle);
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.accent;
                      }}
                    >
                      Message
                    </button>
                  ) : (
                    <button
                      className="hover:opacity-90 transition-opacity"
                      onClick={() =>
                        followBack(
                          notification.sender._id,
                          notification.sender.isPrivate
                        )
                      }
                      style={buttonStyle}
                      onMouseOver={(e) => {
                        Object.assign(e.currentTarget.style, buttonHoverStyle);
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.accent;
                      }}
                    >
                      {following[notification.sender._id] || 'Follow Back'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
