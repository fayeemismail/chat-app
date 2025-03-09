import mongoose, { mongo } from "mongoose";
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
    friends:[{
        type:Schema.Types.ObjectId,
        ref: 'User'
    }],
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
});

const User = mongoose.model('User', userSchema);
export default User;

