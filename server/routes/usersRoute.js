import express from 'express';
import { 
    acceptFriendRequest, 
    createRoom, 
    explore, 
    findRoom, 
    findUsers, 
    getFollowingStatus, 
    notificationPage, 
    profilePage, 
    sendFriendRequest } from '../controllers/userController.js';


const router = express.Router()

router.get('/findUser', findUsers)
router.get('/findRoom', findRoom);

//explore Page
router.get('/explore', explore);
router.post('/sendFollow', sendFriendRequest);
router.get('/following', getFollowingStatus);

//Notification Page
router.get('/notifications', notificationPage);
router.post('/accept_request', acceptFriendRequest)

router.get('/profile', profilePage);
router.post('/create-room', createRoom);

export default router;