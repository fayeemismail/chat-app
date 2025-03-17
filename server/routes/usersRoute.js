import express from 'express';
import multer from 'multer'
import { 
    acceptFriendRequest, 
    createRoom, 
    editProfile, 
    explore, 
    findRoom, 
    findSpecificUser, 
    findUsers, 
    getFollowingStatus, 
    notificationPage, 
    profilePage, 
    sendFriendRequest,
    upload, 
} from '../controllers/userController.js';


const router = express.Router()



router.get('/findSpecificUser', findSpecificUser)

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
router.put('/update-profile', upload.single('profilePicture'), editProfile)


router.post('/create-room', createRoom);

export default router;