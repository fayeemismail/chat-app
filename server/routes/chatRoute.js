import express from 'express';
import { roomMessages } from '../controllers/userController.js';
const router = express.Router()



router.get('/messages/:roomId', roomMessages)

export default router