import React from "react";

const Notification = () => {
    return (
        <div className="min-h-screen bg-emerald-50 text-gray-800">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-4xl font-serif font-semibold text-center text-gray-900 mb-8">
                    Notifications
                </h1>
                <div className="bg-white shadow-xl rounded-lg p-6">
                    <ul className="divide-y divide-gray-300">
                        <li className="py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-gray-800 font-medium">
                                        User Name wants to follow you.
                                    </p>
                                    <span className="text-gray-500 text-sm">Date and Time</span>
                                </div>
                            </div>
                            <div>
                                <button className="bg-blue-500 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all">
                                    Accept
                                </button>
                            </div>
                        </li>
                        <li className="py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-gray-800 font-medium">
                                        User Name is following you.
                                    </p>
                                    <span className="text-gray-500 text-sm">Date and Time</span>
                                </div>
                            </div>
                            <div>
                                <button className="bg-blue-500 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-green-700 transition-all">
                                    Follow Back
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Notification;
