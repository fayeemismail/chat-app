import express from 'express';
import { createRoom, findRoom, findUsers, friendrequest, profilePage } from '../controllers/userController.js';


const router = express.Router()

router.get('/findUser', findUsers)
router.get('/findRoom', findRoom);
router.get('/profile', profilePage);
router.post('/create-room', createRoom);
router.post('/friendrequest', friendrequest);
router.get('/notifications', (req, res) => {
    console.log(req.query)
})

export default router;