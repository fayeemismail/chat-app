import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

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

            // Ensure each user object includes a `requested` field
            const updatedPeople = data.map((person) => ({
                ...person,
                requested: person.requested || false, // Ensure it's either true or false
            }));
            

            setPeople(updatedPeople);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const sendFriendRequest = async (receiverId, isPrivate, userName) => {
        try {
            const result = await Swal.fire({
                title: isPrivate ? "Send Follow Request?" : "Follow User?",
                text: isPrivate
                    ? `Do you want to send a follow request to ${userName}?`
                    : `Do you want to follow ${userName}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: isPrivate ? "Send Request" : "Follow",
                cancelButtonText: "Cancel",
            });

            if (!result.isConfirmed) return;

            const response = await fetch(`/api/users/friendrequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ senderId: user.id, receiverId }),
            });

            const responseData = await response.json();

            if (response.ok) {
                setPeople((prev) =>
                    prev.map((p) =>
                        p._id === receiverId
                            ? {
                                  ...p,
                                  requested: isPrivate || p.requested, // Mark as requested
                                  followers: !isPrivate ? [...(p.followers || []), user.id] : p.followers,
                              }
                            : p
                    )
                );

                Swal.fire({
                    title: isPrivate ? "Request Sent!" : "You are now following!",
                    text: isPrivate
                        ? `Your follow request has been sent to ${userName}.`
                        : `You are now following ${userName}.`,
                    icon: "success",
                });
            } else {
                Swal.fire("Error", responseData.message || "Something went wrong!", "error");
            }
        } catch (error) {
            console.error("Error sending friend request:", error);
            Swal.fire("Error", "Something went wrong!", "error");
        }
    };

    const sendMessage = (receiverId) => {
        console.log(`Navigate to chat with user: ${receiverId}`);
        // Implement navigation to the chat page
    };

    return (
        <div className="min-h-screen bg-emerald-50 text-gray-800">
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-4xl font-serif font-semibold text-center text-gray-900 mb-8">
                    Explore People
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {people.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all ease-in-out duration-300"
                        >
                            <img
                                src={item.profilePicture}
                                alt={item.name}
                                className="w-24 h-24 rounded-full border-4 border-emerald-600 mb-4 mx-auto"
                            />
                            <h2 className="text-2xl font-serif font-bold text-center text-gray-800">
                                {item.name}
                            </h2>
                            <p className="text-center text-gray-600">{item.nation}</p>

                            <div className="mt-4 text-center">
                                {Array.isArray(item.followers) && item.followers.includes(user.id) ? (
                                    <button
                                        onClick={() => sendMessage(item._id)}
                                        className="bg-emerald-600 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all"
                                    >
                                        Send Message
                                    </button>
                                ) : item.isPrivate && !item.followers?.includes(user.id) ? (
                                    <button
                                        onClick={() => sendFriendRequest(item._id, true, item.name)}
                                        className={`${
                                            item.requested ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-gray-700"
                                        } text-white py-2 px-4 rounded-full text-sm font-semibold transition-all`}
                                        disabled={item.requested}
                                    >
                                        {item.requested ? "Requested" : "Send Request"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => sendFriendRequest(item._id, false, item.name)}
                                        className="bg-emerald-600 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all"
                                    >
                                        Follow
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
