import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`/api/users/notifications?userId=${user.id}`);
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const acceptFriendRequest = async (notificationId, senderId) => {
        try {
            const response = await fetch(`/api/users/acceptFriendRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id, senderId }),
            });

            if (response.ok) {
                setNotifications((prevNotifications) =>
                    prevNotifications.map((notif) =>
                        notif._id === notificationId ? { ...notif, accepted: true } : notif
                    )
                );
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50 text-gray-800">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-4xl font-serif font-semibold text-center text-gray-900 mb-8">
                    Notifications
                </h1>

                <div className="bg-white shadow-xl rounded-lg p-6">
                    {notifications.length === 0 ? (
                        <p className="text-center text-gray-500">No new notifications</p>
                    ) : (
                        <ul className="divide-y divide-gray-300">
                            {notifications.map((notification) => (
                                <li key={notification._id} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={notification.sender.profilePhoto}
                                            alt={notification.sender.name}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                        />
                                        <div>
                                            <p className="text-gray-800 font-medium">
                                                {notification.type === "follow_request" ? (
                                                    `${notification.sender.name} sent you a friend request.`
                                                ) : (
                                                    `New activity from ${notification.sender.name}`
                                                )}
                                            </p>
                                            <span className="text-gray-500 text-sm">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    {notification.type === "follow_request" && (
                                        <div>
                                            {notification.accepted ? (
                                                <span className="text-green-500 font-semibold">Accepted</span>
                                            ) : (
                                                <button
                                                    onClick={() => acceptFriendRequest(notification._id, notification.sender._id)}
                                                    className="bg-blue-500 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all"
                                                >
                                                    Accept
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notification;
