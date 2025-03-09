import express from 'express';
import { roomMessages, signin, signup } from '../controllers/userController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);



export default router;

