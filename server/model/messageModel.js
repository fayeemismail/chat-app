import mongoose, { Schema } from "mongoose";

const MessageModel = new Schema({
    chatRoomId:{
        type: Schema.Types.ObjectId,
        index: true,
        required: true
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: { type:String },
    media: { type:String },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    status:{
        type:String,
        enum: ['sent', 'delivered', 'read'], 
        default: 'sent'
    }
});


//APPLYIN TTL INDEX FOR DELETE OLDER MESSAGE MORE THAN 30 DAYS
MessageModel.index({timestamp: 1}, {expireAfterSeconds: 60 * 60 * 24 * 30});    

const Message = mongoose.model("Message", MessageModel);
export default Message;