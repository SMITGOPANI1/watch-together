import { SOCKET_EVENTS } from './events/constants.js';
import presenceManager from './presenceManager.js';
import roomManager from '../services/roomManager.js';

export const registerRoomHandlers = (io, socket) => {
  // 1. JOIN ROOM LISTENER
  socket.on(SOCKET_EVENTS.ROOM_JOIN, (data) => {
    const { roomId } = data;
    if (!roomId) return;

    const user = socket.user;
    socket.join(roomId);

    // Track active presence inside the room
    const participantsList = presenceManager.addUserToRoom(roomId, user, socket.id);

    console.log(`[SOCKET.IO]: User "${user.username}" joined room "${roomId}". Socket ID: ${socket.id}`);

    // Broadcast updated participant array list to all room sockets
    io.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE, {
      roomId,
      participants: participantsList
    });

    // Send a system notification alert to other members
    socket.to(roomId).emit(SOCKET_EVENTS.NOTIFICATION_NEW, {
      id: `sys_not_${Date.now()}`,
      text: `${user.username} entered the cinema watch party! 👋`,
      type: 'info'
    });
  });

  // 2. LEAVE ROOM LISTENER
  socket.on(SOCKET_EVENTS.ROOM_LEAVE, (data) => {
    const { roomId } = data;
    if (!roomId) return;

    const user = socket.user;
    const userId = user.firebaseUid || (user.id || user._id)?.toString();
    socket.leave(roomId);

    // Clean up active presence first
    const remainingParticipants = presenceManager.removeUserFromRoom(roomId, userId, socket.id);

    console.log(`[SOCKET.IO]: User "${user.username}" left room "${roomId}". Socket ID: ${socket.id}`);

    // Check if the leaving user is the Host of that room and apply a 5-second grace period
    const room = roomManager.getRoom(roomId);
    if (room) {
      const isHost = room.hostName === (user.username || user.name);
      if (isHost) {
        setTimeout(() => {
          // Re-fetch active participants after 1s delay
          const currentParticipants = presenceManager.getRoomParticipants(roomId);
          const hostStillExists = currentParticipants.some(p => p.role === 'Host' || p.name === room.hostName);
          
          if (!hostStillExists) {
            console.log(`[SOCKET.IO]: Host "${user.username}" left room "${roomId}" completely after grace period. Dismantling room...`);
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

    // Broadcast updated participant list
    io.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE, {
      roomId,
      participants: remainingParticipants
    });

    // Send leave notification alert
    socket.to(roomId).emit(SOCKET_EVENTS.NOTIFICATION_NEW, {
      id: `sys_not_${Date.now()}`,
      text: `${user.username} left the watch party.`,
      type: 'info'
    });
  });

  // 3. CLOSE ROOM LISTENER (ADMIN / HOST ONLY)
  socket.on(SOCKET_EVENTS.ROOM_CLOSE, (data) => {
    const { roomId } = data;
    if (!roomId) return;

    const user = socket.user;
    const room = roomManager.getRoom(roomId);

    if (!room) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Target room not found.' });
    }

    // Verify the sender is indeed the host of that room case-sensitively
    const isHost = room.hostName === (user.username || user.name);
    if (!isHost) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Unauthorized. Only the Host can close the watch party.' });
    }

    console.log(`[SOCKET.IO]: Host "${user.username}" is closing room "${roomId}".`);

    // Remove room from room manager
    roomManager.closeRoom(roomId);

    // Broadcast ROOM_CLOSED notification event to all clients in the room
    io.to(roomId).emit(SOCKET_EVENTS.ROOM_CLOSED, {
      roomId,
      message: 'The Host has closed this watch party session. Redirecting to Dashboard... 🏠'
    });

    // Make all sockets in that room leave
    io.in(roomId).socketsLeave(roomId);
  });
};

export default registerRoomHandlers;
