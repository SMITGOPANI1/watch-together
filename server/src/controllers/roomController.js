import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import roomManager from '../services/roomManager.js';
import User from '../models/User.js';

export const getRooms = catchAsync(async (req, res) => {
  const rooms = roomManager.getAllRooms();
  res.status(200).json({
    status: 'success',
    results: rooms.length,
    data: { rooms }
  });
});

export const getRoom = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const room = roomManager.getRoom(roomId);

  if (!room) {
    throw new AppError(`Room with ID "${roomId}" was not found or has been closed.`, 404);
  }

  res.status(200).json({
    status: 'success',
    data: { room }
  });
});

export const createRoom = catchAsync(async (req, res) => {
  const { name, category, isPrivate, hostName, hostId } = req.body;

  const resolvedHost = hostName || 'Smit Gopani';
  const newRoom = roomManager.createRoom(name, category, isPrivate, resolvedHost, hostId);

  // Increment roomsHosted in the database for the creator
  if (hostId) {
    try {
      await User.findOneAndUpdate({ firebaseUid: hostId }, { $inc: { roomsHosted: 1 } });
      console.log(`[DATABASE]: Incremented roomsHosted count for host UID: ${hostId}`);
    } catch (e) {
      console.error('[DATABASE ERROR]: Failed to increment roomsHosted count:', e);
    }
  }

  res.status(201).json({
    status: 'success',
    data: { room: newRoom }
  });
});

export const joinRoom = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const { userName } = req.body;

  if (!userName || !userName.trim()) {
    throw new AppError('UserName body property is required to join a watch party.', 400);
  }

  const room = roomManager.joinRoom(roomId, userName);
  if (!room) {
    throw new AppError(`Room with ID "${roomId}" was not found.`, 404);
  }

  res.status(200).json({
    status: 'success',
    message: `${userName} successfully joined the room session.`,
    data: { room }
  });
});

export const leaveRoom = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const { userName } = req.body;

  if (!userName || !userName.trim()) {
    throw new AppError('UserName body property is required to leave a watch party.', 400);
  }

  const result = roomManager.leaveRoom(roomId, userName);
  if (!result) {
    throw new AppError(`Room with ID "${roomId}" was not found.`, 404);
  }

  if (result.destroyed) {
    return res.status(200).json({
      status: 'success',
      message: 'Room was closed successfully since all participants left.',
      data: { room: null }
    });
  }

  res.status(200).json({
    status: 'success',
    message: `${userName} successfully left the room session.`,
    data: { room: result }
  });
});
