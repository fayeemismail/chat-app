import express from 'express';
import { logoutUser, roomMessages, signin, signup } from '../controllers/userController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', logoutUser);


export default router;

