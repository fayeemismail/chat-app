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
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            {notification.type === "follow_request" ? (
                                                `${notification.senderName} sent you a friend request.`
                                            ) : (
                                                `New activity from ${notification.senderName}`
                                            )}
                                        </p>
                                        <span className="text-gray-500 text-sm">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>
                                    </div>
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
