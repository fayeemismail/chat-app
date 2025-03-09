import User from "../model/userModel.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv, { populate } from 'dotenv';
import Message from "../model/messageModel.js";
import ChatRoom from "../model/chatRoomModel.js";
import mongoose from "mongoose";

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
        console.log(name, email, password, confirmPassword)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error!" });
    }
}



export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);

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
                // Add other user details if needed
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error!' });
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