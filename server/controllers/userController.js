import User from "../model/userModel.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Message from "../model/messageModel.js";
import ChatRoom from "../model/chatRoomModel.js";
import mongoose from "mongoose";
import multer from 'multer';

import dotenv from 'dotenv';
import cloudinary from '../config/cloudinary.js';

const storage = multer.memoryStorage();
export const upload = multer({storage})

dotenv.config();



const passwordValidation = (password) => {
    const regex = /\d/;
    return regex.test(password)
}
const emailValidation = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};


export const signup = async (req, res, next) => {
    try {
        let { name, email, password, confirmPassword } = req.body;

        if (!name || name.length < 3) {
            return res.status(400).json({ error: "Name must be at least 3 characters long!" });
        }

        if (!email || !emailValidation(email)) {
            return res.status(400).json({ error: "Invalid email format!" });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered!" });
        }


        if (!password || !confirmPassword) {
            return res.status(400).json({ error: "Both password and confirm Password are required!" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password does not Match" })
        }

        if (!passwordValidation(password)) {
            return res.status(400).json({ error: "Password Must contain one number!" })
        }

        let hashedPassword = await bcryptjs.hash(password, 10)

        let newUser = new User({ name: name, email: email, password: hashedPassword })
        let saved = newUser.save()
        if (saved) {
            console.log('user saved successfully')
            res.status(201).json({ message: 'User Created successfully!' })
        } else {
            res.status(500).json({ error: 'Failed to save User!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error!" });
    }
}


export const findSpecificUser = async(req, res, next) => {
    try {
        const { userId } = req.query
        const userData = await User.findById(userId);
        if(!userData){
            return res.status(404).json({error: "User not found"});
        } 
        res.status(200).json(userData)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server Error" })
    }
}


export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation for email
        if (!email || !emailValidation(email)) {
            return res.status(400).json({ error: 'Invalid email Format' });
        }

        // Validation for password
        if (!password || !passwordValidation(password)) {
            return res.status(400).json({ error: 'Invalid Password format' });
        }

        let existingUser = await User.findOne({ email: email });
        // Checking if there is any existing user
        if (!existingUser) {
            return res.status(400).json({ error: 'User Not Found' });
        }

        let validPassword = await bcryptjs.compare(password, existingUser.password);
        // Checking if the given password is correct
        if (!validPassword) {
            return res.status(400).json({ error: 'Password Mismatch' });
        }

        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.status(200).json({
            message: 'Login Successful!',
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                followers: existingUser.followers,
                following: existingUser.following,
                notification: existingUser.notification,
                isPrivate: existingUser.isPrivate,
                pendingRequest: existingUser.pendingRequest
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error!' });
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        res.status(200).json({ message: "Logout Successful" })
    } catch (error) {
        res.status(500).json({ error: "Logout Failed" })
    }
}




export const findUsers = async (req, res, next) => {
    try {
        const { userId } = req.query
        console.log(userId)
        const users = await User.find({ _id: { $ne: userId } })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
}

export const findRoom = async (req, res, next) => {
    try {
        const rooms = await ChatRoom.find()
        res.status(200).json(rooms)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const explore = async(req, res, next) => {
    try {
        const {userId} = req.query
        const loggedUser = await User.findById(userId)
        const users = await User.find({ _id:{ $ne: userId, $nin: loggedUser.following } })
        res.json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error"})
    }
}


export const getFollowingStatus = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User.findById(userId).populate("following");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const followData = user.following.map(followingUser => ({
            _id: followingUser._id,
            status: "Following"
        }));

        // Check for pending requests in the notification array
        const requestedUsers = await User.find({
            "notifications.sender": userId,
            "notifications.type": "follow_request",
        });

        requestedUsers.forEach(requestedUser => {
            followData.push({
                _id: requestedUser._id,
                status: "Requested"
            });
        });

        res.json(followData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};




export const sendFriendRequest = async(req, res, next) =>{
    try {
        const { targetUserId, currentUserId } = req.body;
        const user = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ error: 'User not Found!' });
        }

        if (targetUser.isPrivate) {
            // Check if request already exists in notifications
            const alreadyRequested = targetUser.notifications.some(
                (notification) => notification.sender.toString() === currentUserId
            );

            if (!alreadyRequested) {
                targetUser.notifications.push({
                    sender: currentUserId,
                    type: "follow_request",
                    message: `${user.name} sent you a follow request.`,
                });
                targetUser.pendingRequest.push(currentUserId)
                await targetUser.save();
                return res.json({ success: true, message: "Follow request sent" });
            }

            return res.json({ success: false, message: "Request already sent" });
        }

        if (!user.following.includes(targetUserId)) {
            user.following.push(targetUserId);
            await user.save();
        }

        if (!targetUser.followers.includes(currentUserId)) {
            targetUser.followers.push(currentUserId);
            targetUser.notifications.push({
                sender: currentUserId,
                type: "new_follower",
                message: `${user.name} followed you`
            })
            await targetUser.save();
        }
        
        res.json({ success: true, message: "Followed successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server Error" });
    }
};




export const profilePage = async (req, res, next) => {
    try {
        const { userId } = req.query
        const userData = await User.findOne({ _id: userId })
        res.status(200).json(userData)
    } catch (error) {

    }
}



export const createRoom = async (req, res, next) => {
    try {
        const {userId, name} = req.body
        console.log(userId, name);
        const existingRoom = await ChatRoom.findOne({name: name})
        if(!existingRoom){
            const newRoom = new ChatRoom({
                name: name,
                admin: userId,
            })
    
            let save = newRoom.save()
            if(save){
               return res.status(200).json({message:"Room created successfully"})
            }
        }
        res.status(409).json({error: "Something went wrong try diffrent Name"})
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}









export const notificationPage = async (req, res, next) => {
    try {
        const { userId } = req.query;

        // Find the user
        const userData = await User.findById(userId).populate('notifications.sender');

        if (!userData) {
            return res.status(404).json({ error: "User Not found" });
        }

        
        res.json(userData.notifications);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server Error" });
    }
};





export const acceptFriendRequest = async (req, res, next) => {
    try {
        const { userId, targetId, notificationId } = req.body;

        const currentUser = await User.findById(userId);
        const targetUser = await User.findById(targetId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Check if targetId exists in pendingRequest array
        if (!currentUser.pendingRequest.includes(targetId)) {
            return res.status(404).json({ error: "No request found" });
        }

        // Remove targetId from pendingRequest
        currentUser.pendingRequest = currentUser.pendingRequest.filter(id => id.toString() !== targetId);

        // Find the specific notification
        const notificationIndex = currentUser.notifications.findIndex(
            notification => notification.sender.toString() === targetId && notification._id.toString() === notificationId
        );

        if (notificationIndex !== -1) {
            currentUser.notifications[notificationIndex].type = 'new_follower';
        }


        currentUser.followers.push(targetId);
        targetUser.following.push(userId);
        await targetUser.save()

        // Save changes
        let save = await currentUser.save();
        if(save){
            console.log('saved')
            return res.status(200).json({ message: "Friend request accepted" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};






export const editProfile = async (req, res) => {
    try {
        const { userId, name, bio, isPrivate, password, profilePhoto , confirmPassword } = req.body;

        // Find user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Password change logic
        if (password || confirmPassword) {
            if (!passwordValidation(password)) {
                return res.status(400).json({ error: "Password must contain at least one digit." });
            }
            if (password !== confirmPassword) {
                return res.status(400).json({ error: "Passwords do not match." });
            }
            user.password = await bcryptjs.hash(password, 10);
        }

        // Update user fields
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (isPrivate !== undefined) user.isPrivate = isPrivate;
        if(profilePhoto) user.profilePhoto = profilePhoto

        

        // Save user to the database
        await user.save();

        res.status(200).json({ success: true, message: "Profile updated successfully", user });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




export const roomMessages = async (req, res, next) => {
    try {
        // const { roomId } = req.params;
        // console.log(roomId, 'this is room id');

        // // Check if the roomId is a valid ObjectId
        // if (!mongoose.Types.ObjectId.isValid(roomId)) {
        //     return res.status(400).json({ message: 'Invalid room ID format' });
        // }

        // // Fetch the messages for the room
        // const messages = await Message.find({ chatRoomId: roomId })
        //     .sort({ timestamp: 1 })
        //     .populate('sender', 'name')  // Populating the sender field with the user name
        //     .exec();

        // res.status(200).json(messages || []);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: `Error fetching messages: ${error.message}` });
    }
};