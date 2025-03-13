import express from 'express';
import { createRoom, findRoom, findUsers, notificationPage, profilePage, sendFriendRequest } from '../controllers/userController.js';


const router = express.Router()

router.get('/findUser', findUsers)
router.get('/findRoom', findRoom);
router.get('/profile', profilePage);
router.post('/create-room', createRoom);
router.post('/friendrequest', sendFriendRequest);
router.get('/notifications', notificationPage);

export default router;