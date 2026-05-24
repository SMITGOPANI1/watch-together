import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

router.route('/:roomId')
  .get(getMessages)
  .post(sendMessage);

export default router;
