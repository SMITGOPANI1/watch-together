import { Server } from 'socket.io';
import config from '../config/environment.js';

export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Heartbeat configurations to detect active network drops quickly
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  console.log('[SOCKET.IO]: Real-time Socket Server Initialized Successfully.');

  // Basic connection hooks prepared for later synchronized player logic phases
  io.on('connection', (socket) => {
    console.log(`[SOCKET.IO]: New client connected. Socket ID: ${socket.id}`);

    // Join room placeholder listener
    socket.on('join_room', (data) => {
      const { roomId, userName } = data;
      socket.join(roomId);
      console.log(`[SOCKET.IO]: User "${userName}" joined room "${roomId}". Socket ID: ${socket.id}`);
      
      // Broadcast entry status to other room sockets
      socket.to(roomId).emit('user_joined', { userName, socketId: socket.id });
    });

    // Sync media controls placeholder listener
    socket.on('sync_video', (data) => {
      const { roomId, videoId, currentTime, isPlaying } = data;
      console.log(`[SOCKET.IO]: Syncing room "${roomId}" to video ${videoId} at ${currentTime}s`);
      socket.to(roomId).emit('video_synced', { videoId, currentTime, isPlaying });
    });

    // Chat messages placeholder listener
    socket.on('chat_message', (data) => {
      const { roomId, text, userName } = data;
      io.to(roomId).emit('message_received', {
        id: `socket_msg_${Date.now()}`,
        userName,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });

    // Dynamic disconnect logging
    socket.on('disconnect', () => {
      console.log(`[SOCKET.IO]: Client disconnected. Socket ID: ${socket.id}`);
    });
  });

  return io;
};

export default initSocketServer;
