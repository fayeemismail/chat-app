import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Explore = () => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState({});
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchUsersAndFollowStatus = async () => {
            try {
                // Fetch users
                const userRes = await axios.get(`/api/users/explore/?userId=${currentUser.id}`);
                setUsers(userRes.data);
    
                // Fetch following status
                const followRes = await axios.get(`/api/users/following/?userId=${currentUser.id}`);
    
                // Convert response to an object { userId: "Following" or "Requested" }
                const followStatus = {};
                followRes.data.forEach(user => {
                    followStatus[user._id] = user.status; // "Following" or "Requested"
                });
    
                setFollowing(followStatus);
            } catch (error) {
                console.error("Error fetching users or follow status", error);
            }
        };
    
        fetchUsersAndFollowStatus();
    }, [currentUser.id]);
    

    const handleFollow = async (userId, isPrivate) => {
        try {
            // Prevent duplicate request updates
            if (following[userId] === "Requested") return;
    
            setFollowing(prev => ({
                ...prev,
                [userId]: isPrivate ? "Requested" : "Following",
            }));
    
            await axios.post('/api/users/sendFollow', { targetUserId: userId, currentUserId: currentUser.id });
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <div className="min-h-screen bg-[#F5F1E3] text-[#4A403A] font-serif">
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-center text-[#2C2A29] mb-10">
                    Explore People
                </h1>
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="bg-[#EDE3D9] p-4 rounded-lg shadow-md hover:shadow-lg transition-all border border-[#C2B8A3] flex items-center space-x-4"
                        >
                            <img
                                src={user.profilePicture }
                                alt={user.name}
                                className="w-16 h-16 rounded-full border-2 border-[#A68A64] object-cover"
                            />
                            <div className="flex-1">
                                <h2 className="text-md font-bold text-[#2C2A29]">{user.name}</h2>
                                <p className="text-sm text-[#6D6459] italic">Followers: {user.followers?.length || 0}</p>
                                <button
                                    onClick={() => handleFollow(user._id, user.isPrivate)}
                                    className="mt-2 bg-[#A68A64] text-white py-1 px-3 rounded-full text-sm font-semibold hover:bg-[#8C7357] transition-all"
                                >
                                    {following[user._id] || "Follow"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Explore;
