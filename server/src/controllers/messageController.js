import Message from '../models/Message.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import roomManager from '../services/roomManager.js';

export const getMessages = catchAsync(async (req, res) => {
  const { roomId } = req.params;

  const room = roomManager.getRoom(roomId);
  const currentHostName = room ? room.hostName : '';

  let messages = [];
  try {
    const dbMessages = await Message.find({ roomId })
      .sort({ timestamp: 1 })
      .limit(100);

    if (dbMessages && dbMessages.length > 0) {
      messages = dbMessages.map(msg => ({
        id: msg._id.toString(),
        userName: msg.sender?.name || 'WatchHive Explorer',
        avatar: msg.sender?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${msg._id}`,
        text: msg.message,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isHost: currentHostName ? (msg.sender?.name === currentHostName) : false
      }));
    }
  } catch (err) {
    console.error('[DATABASE MESSAGES ERROR]:', err);
  }



  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages
    }
  });
});

export const sendMessage = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const { text, userName } = req.body;

  if (!text || !text.trim()) {
    throw new AppError('Message text field cannot be blank.', 400);
  }

  const room = roomManager.getRoom(roomId);
  const currentHostName = room ? room.hostName : 'Smit Gopani';

  // Simulated fallback messaging delivery log (Sockets handles actual persistence in live rooms)
  res.status(201).json({
    status: 'success',
    data: {
      message: {
        id: `msg_${Date.now()}`,
        roomId,
        userName: userName || 'Smit Gopani',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userName || 'Smit')}`,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isHost: currentHostName ? (userName === currentHostName) : (userName === 'Smit Gopani')
      }
    }
  });
});
