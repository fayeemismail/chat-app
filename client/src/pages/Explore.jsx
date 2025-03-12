import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const Explore = () => {
    const [people, setPeople] = useState([]);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/users/findUser?userId=${user.id}`);
            const data = await response.json();
            setPeople(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const sendFriendRequest = async (receiverId) => {
        try {
            await fetch(`api/users/friendrequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ senderId: user.id, receiverId }),
            });

            // Show SweetAlert2 success message
            Swal.fire({
                title: "Friend Request Sent!",
                text: "Your friend request has been successfully sent.",
                icon: "success",
                confirmButtonColor: "#4CAF50",
            });

        } catch (error) {
            console.error("Error sending friend request:", error);

            // Show error alert
            Swal.fire({
                title: "Error",
                text: "Failed to send friend request. Please try again.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    const sendMessage = (receiverId) => {
        console.log(`Navigate to chat with user: ${receiverId}`);
        // Implement navigation to chat page
    };

    return (
        <div className="min-h-screen bg-emerald-50 text-gray-800">
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-4xl font-serif font-semibold text-center text-gray-900 mb-8">Explore People</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {people.map((item) => (
                        <div key={item._id} className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all ease-in-out duration-300">
                            <img
                                src={item.profilePicture}
                                alt={item.name}
                                className="w-24 h-24 rounded-full border-4 border-emerald-600 mb-4 mx-auto"
                            />
                            <h2 className="text-2xl font-serif font-bold text-center text-gray-800">{item.name}</h2>
                            <p className="text-center text-gray-600">{item.nation}</p>

                            <div className="mt-4 text-center">
                                {!item.isPrivate && !item.friends.includes(user.id) ? (
                                    <button
                                        onClick={() => sendFriendRequest(item._id)}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all"
                                    >
                                        Send Friend Request
                                    </button>
                                ) : item.friends.includes(user.id) ? (
                                    <button
                                        onClick={() => sendMessage(item._id)}
                                        className="bg-emerald-600 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all"
                                    >
                                        Send Message
                                    </button>
                                ) : (
                                    <button className="bg-emerald-600 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all">
                                        View Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Explore;
