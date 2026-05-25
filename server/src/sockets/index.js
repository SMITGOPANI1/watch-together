import { Server } from 'socket.io';
import config from '../config/environment.js';
import socketAuth from './socketAuth.js';
import registerRoomHandlers from './roomHandler.js';
import registerChatHandlers from './chatHandler.js';
import registerDisconnectHandlers from './disconnectHandler.js';
import registerPlaybackHandlers from './playbackHandler.js';

export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Dynamically allow any origin that connects, secured by Firebase auth
        callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Heartbeat configurations to detect active network drops quickly
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  console.log('[SOCKET.IO]: Real-time Socket Server Initializing...');

  // Register Handshake Security Middleware
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`[SOCKET.IO]: Secure client connected. User: "${socket.user?.username}". Socket ID: ${socket.id}`);

    // Register Modular Event Handlers
    registerRoomHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerDisconnectHandlers(io, socket);
    registerPlaybackHandlers(io, socket);
  });

  console.log('[SOCKET.IO]: Secure Real-time Socket Server Initialized Successfully.');
  return io;
};

export default initSocketServer;
