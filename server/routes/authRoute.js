import express from 'express';
import { logoutUser, refreshToken, roomMessages, signin, signup } from '../controllers/userController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', logoutUser);
router.post('/refresh-token', refreshToken)


export default router;
