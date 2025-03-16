import express from 'express';
import multer from 'multer'
import { 
    acceptFriendRequest, 
    createRoom, 
    editProfile, 
    explore, 
    findRoom, 
    findUsers, 
    getFollowingStatus, 
    notificationPage, 
    profilePage, 
    sendFriendRequest 
} from '../controllers/userController.js';


const router = express.Router()

//Initializing multer for file Uploading
const storage = multer.memoryStorage();
const upload = multer({ storage })



router.get('/findUser', findUsers)
router.get('/findRoom', findRoom);

//explore Page
router.get('/explore', explore);
router.post('/sendFollow', sendFriendRequest);
router.get('/following', getFollowingStatus);

//Notification Page
router.get('/notifications', notificationPage);
router.post('/accept_request', acceptFriendRequest)

//Profile Page
router.get('/profile', profilePage);
router.post('/update-profile', upload.single('profilePicture'), editProfile)


router.post('/create-room', createRoom);

export default router;