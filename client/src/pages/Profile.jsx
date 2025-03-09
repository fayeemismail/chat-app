import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
    const [user, setUser] = useState(null);
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`/api/users/profile?userId=${currentUser.id}`);
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.log(error);
        }
    };

    if (!user) {
        return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center h-screen z-0 bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                {/* Profile Image */}
                <div className="flex justify-center">
                    <img
                        src={user.profilePicture? user.profilePicture:''}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                    />
                </div>

                {/* User Info */}
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>

                {/* Additional Info */}
                <div className="mt-4">
                    <p className="text-gray-700">
                        <span className="font-semibold">Followers:</span> {user.followers || 0}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Following:</span> {user.following || 0}
                    </p>
                </div>

                {/* Edit Profile Button */}
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
