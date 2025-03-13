import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
    type:{
        type: String,
        enum:["follow_request", "new_room", "message", "mention", "new_follower"],
        required: true
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "ChatRoom"
    },
    message: {
        type: String
    },
    isRead:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const notification = mongoose.model("notification", notificationSchema);
export default notification