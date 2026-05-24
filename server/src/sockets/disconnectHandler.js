import { SOCKET_EVENTS } from './events/constants.js';
import presenceManager from './presenceManager.js';
import roomManager from '../services/roomManager.js';

export const registerDisconnectHandlers = (io, socket) => {
  // DISCONNECT EVENT LISTENER
  socket.on('disconnect', () => {
    const user = socket.user;
    
    // Clean up active registry presence
    const disconnectInfo = presenceManager.handleSocketDisconnect(socket.id);

    if (disconnectInfo) {
      const { roomId, remainingParticipants } = disconnectInfo;

      // Check if the disconnected user is the Host of that room and apply a 5-second grace period
      const room = roomManager.getRoom(roomId);
      if (room) {
        const isHost = room.hostName === (user.username || user.name);
        if (isHost) {
          setTimeout(() => {
            // Verify if the host has reconnected within the 1s grace period
            const currentParticipants = presenceManager.getRoomParticipants(roomId);
            const hostStillExists = currentParticipants.some(p => p.role === 'Host' || p.name === room.hostName);
            
            if (!hostStillExists) {
              console.log(`[SOCKET.IO]: Host "${user.username}" disconnected completely after grace period. Dismantling room "${roomId}"...`);
              roomManager.closeRoom(roomId);
              
              io.to(roomId).emit(SOCKET_EVENTS.ROOM_CLOSED, {
                roomId,
                message: 'The Host has left the watch party. This session has ended! 🏠'
              });
              
              // Flush network buffers before kicking sockets
              setTimeout(() => {
                io.in(roomId).socketsLeave(roomId);
              }, 500);
            }
          }, 1000);
          return;
        }
      }

      // Broadcast updated participant array to all other sockets
      io.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE, {
        roomId,
        participants: remainingParticipants
      });

      // Broadcast disconnect system notification alert
      socket.to(roomId).emit(SOCKET_EVENTS.NOTIFICATION_NEW, {
        id: `sys_not_${Date.now()}`,
        text: `${user.username} lost connection or left the session. 🌐`,
        type: 'warning'
      });
    } else {
      console.log(`[SOCKET.IO]: Unregistered client disconnected. Socket ID: ${socket.id}`);
    }
  });
};

export default registerDisconnectHandlers;
