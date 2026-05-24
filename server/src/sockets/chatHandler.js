import { SOCKET_EVENTS } from './events/constants.js';
import Message from '../models/Message.js';
import roomManager from '../services/roomManager.js';

export const registerChatHandlers = (io, socket) => {
  // 1. SEND MESSAGE LISTENER
  socket.on(SOCKET_EVENTS.CHAT_SEND, async (data) => {
    const { roomId, text } = data;
    if (!roomId || !text || !text.trim()) return;

    const user = socket.user;
    const userId = user.firebaseUid || (user.id || user._id)?.toString();
    
    const messagePayload = {
      id: `msg_socket_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      roomId,
      message: text.trim(),
      messageType: 'chat',
      sender: {
        name: user.username || user.name,
        avatar: user.avatar,
        userId: user._id ? user._id.toString() : null
      },
      timestamp: new Date()
    };

    // Database Persistence Step
    try {
      await Message.create({
        roomId,
        message: text.trim(),
        messageType: 'chat',
        sender: {
          name: user.username || user.name,
          avatar: user.avatar,
          userId: user._id ? user._id.toString() : null
        }
      });
      console.log(`[CHAT DATABASE]: Saved message in room "${roomId}" from "${user.username}"`);
    } catch (dbErr) {
      console.warn('[CHAT DATABASE WARNING]: Failed to persist message, continuing in memory:', dbErr.message);
    }

    const room = roomManager.getRoom(roomId);
    const isSenderHost = room 
      ? (room.hostId ? room.hostId === userId : room.hostName === (user.username || user.name))
      : false;

    // Broadcast message instantly to everyone in the room
    io.to(roomId).emit(SOCKET_EVENTS.CHAT_RECEIVE, {
      ...messagePayload,
      isHost: isSenderHost,
      timestamp: messagePayload.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  // 2. TYPING INDICATOR LISTENER
  socket.on(SOCKET_EVENTS.USER_TYPING, (data) => {
    const { roomId, isTyping } = data;
    if (!roomId) return;

    const user = socket.user;

    // Relay active typing state to all OTHER room sockets
    socket.to(roomId).emit(SOCKET_EVENTS.USER_TYPING, {
      userName: user.username || user.name,
      isTyping
    });
  });
};

export default registerChatHandlers;
