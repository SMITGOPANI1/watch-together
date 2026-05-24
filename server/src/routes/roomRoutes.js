import express from 'express';
import { getRooms, getRoom, createRoom, joinRoom, leaveRoom } from '../controllers/roomController.js';
import { validateRoomCreation } from '../validators/roomValidator.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(validateRoomCreation, createRoom);

router.route('/:roomId')
  .get(getRoom);

router.route('/:roomId/join')
  .post(joinRoom);

router.route('/:roomId/leave')
  .post(leaveRoom);

export default router;
