import mongoose,  { Schema } from "mongoose";

const ChatRoomSchema = new Schema({
    name: String,
    isGroup: {
        type: Boolean,
        default: false
    },
    members:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    lastMessage:{
        text: String,
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        timestamp: Date,
    },
    admin:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}); 



const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
export default ChatRoom;



