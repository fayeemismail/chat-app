import mongoose, { mongo } from "mongoose";
import notification from "./notificationModel.js";
const {Schema} = mongoose; 

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{  
        type:String,
        required: true
    },
    profilePhoto:{
        type:String,
        default: ''
    },
    status:{
        type: String, 
        enum:['online', 'offline', 'away'], 
        default: 'offline'
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    isPrivate:{
        type:Boolean,
        default:false
    },
    socketId: {
        type: String,
        default: '',
    },
    notification:[{
        type: Schema.Types.ObjectId,
        ref: "notification"
    }],
    pendingRequest:[{
        type: Schema.Types.ObjectId,
        ref:"User"
    }],
    followers:[{
        type: Schema.Types.ObjectId, 
        ref: "User"
    }],
    following:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

const User = mongoose.model('User', userSchema);
export default User;