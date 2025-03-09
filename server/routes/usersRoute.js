import express from 'express';
import { findRoom, findUsers, profilePage } from '../controllers/userController.js';


const router = express.Router()

router.get('/findUser', findUsers)
router.get('/findRoom', findRoom);
router.get('/profile', profilePage)

export default router;