import { SOCKET_EVENTS } from './events/constants.js';
import roomManager from '../services/roomManager.js';

export const registerPlaybackHandlers = (io, socket) => {
  // Helpers to validate Host authority
  const validateHost = (roomId) => {
    const room = roomManager.getRoom(roomId);
    if (!room) return { authorized: false, error: 'Room not found.' };

    const user = socket.user;
    const userId = user.firebaseUid || (user.id || user._id)?.toString();
    const isHost = room.hostId ? room.hostId === userId : room.hostName === (user.username || user.name);

    if (!isHost) {
      return { authorized: false, error: 'Unauthorized. Only the Host can control playback.' };
    }

    return { authorized: true, room };
  };

  // 1. PLAY VIDEO
  socket.on(SOCKET_EVENTS.VIDEO_PLAY, (data) => {
    const { roomId, currentTime } = data;
    if (!roomId) return;

    const { authorized, room, error } = validateHost(roomId);
    if (!authorized) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: error });
    }

    console.log(`[PLAYBACK]: Host "${room.hostName}" played video in room "${roomId}" at ${currentTime}s`);

    // Save playing state inside Room Manager
    roomManager.updatePlaybackState(roomId, true, currentTime);

    // Broadcast play event to all other members in the room
    socket.to(roomId).emit(SOCKET_EVENTS.VIDEO_PLAY, { currentTime });

    // Send a system notification alert to other members
    socket.to(roomId).emit(SOCKET_EVENTS.NOTIFICATION_NEW, {
      id: `sys_not_${Date.now()}`,
      text: `${room.hostName} started the stream! 🍿`,
      type: 'info'
    });
  });

  // 2. PAUSE VIDEO
  socket.on(SOCKET_EVENTS.VIDEO_PAUSE, (data) => {
    const { roomId, currentTime } = data;
    if (!roomId) return;

    const { authorized, room, error } = validateHost(roomId);
    if (!authorized) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: error });
    }

    console.log(`[PLAYBACK]: Host "${room.hostName}" paused video in room "${roomId}" at ${currentTime}s`);

    // Save paused state inside Room Manager
    roomManager.updatePlaybackState(roomId, false, currentTime);

    // Broadcast pause event
    socket.to(roomId).emit(SOCKET_EVENTS.VIDEO_PAUSE, { currentTime });

    // Send notification
    socket.to(roomId).emit(SOCKET_EVENTS.NOTIFICATION_NEW, {
      id: `sys_not_${Date.now()}`,
      text: `${room.hostName} paused the stream. ⏸️`,
      type: 'info'
    });
  });

  // 3. SEEK TIMELINE
  socket.on(SOCKET_EVENTS.VIDEO_SEEK, (data) => {
    const { roomId, currentTime } = data;
    if (!roomId) return;

    const { authorized, room, error } = validateHost(roomId);
    if (!authorized) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: error });
    }

    console.log(`[PLAYBACK]: Host "${room.hostName}" seeked video in room "${roomId}" to ${currentTime}s`);

    // Update time registry in Room Manager
    roomManager.updatePlaybackSeek(roomId, currentTime);

    // Broadcast seek event
    socket.to(roomId).emit(SOCKET_EVENTS.VIDEO_SEEK, { currentTime });
  });

  // 4. SWAP/CHANGE VIDEO
  socket.on(SOCKET_EVENTS.VIDEO_CHANGE, (data) => {
    const { roomId, youtubeId, videoTitle, duration } = data;
    if (!roomId || !youtubeId) return;

    const { authorized, room, error } = validateHost(roomId);
    if (!authorized) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: error });
    }

    console.log(`[PLAYBACK]: Host "${room.hostName}" changed video in room "${roomId}" to "${videoTitle}" (${youtubeId})`);

    // Save details in Room Manager
    roomManager.changeVideo(roomId, youtubeId, videoTitle, duration);

    // Broadcast change event to everyone including the host (for synchronized load triggers)
    io.to(roomId).emit(SOCKET_EVENTS.VIDEO_CHANGE, { youtubeId, videoTitle, duration });

    // Send notification
    socket.to(roomId).emit(SOCKET_EVENTS.NOTIFICATION_NEW, {
      id: `sys_not_${Date.now()}`,
      text: `Video changed: ${videoTitle} 🎬`,
      type: 'success'
    });
  });

  // 5. UPDATE SHARED QUEUE
  socket.on(SOCKET_EVENTS.QUEUE_UPDATE, (data) => {
    const { roomId, queue } = data;
    if (!roomId) return;

    const { authorized, room, error } = validateHost(roomId);
    if (!authorized) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: error });
    }

    console.log(`[PLAYBACK]: Host updated collaborative queue in room "${roomId}"`);

    // Save inside Room Manager
    roomManager.updateQueue(roomId, queue);

    // Broadcast queue update to all other members in the room
    socket.to(roomId).emit(SOCKET_EVENTS.QUEUE_UPDATE, { queue });
  });

  // 6. SYNC ON REQUEST (LATE JOIN / RECONNECT RECOVERY)
  socket.on(SOCKET_EVENTS.VIDEO_SYNC, (data) => {
    const { roomId } = data;
    if (!roomId) return;

    const room = roomManager.getRoom(roomId);
    if (!room) return;

    // Calculate dynamic time progress if the Host is actively playing the stream
    let currentCalculatedTime = room.currentTime;
    if (room.playbackState === 'playing') {
      const elapsedSeconds = (Date.now() - room.lastUpdated) / 1000;
      currentCalculatedTime += elapsedSeconds;
    }

    console.log(`[PLAYBACK]: Viewer requested sync for room "${roomId}". Returning calculated timestamp: ${currentCalculatedTime}s. Playback state: "${room.playbackState}"`);

    // Return the calculated state back to the requester ONLY
    socket.emit(SOCKET_EVENTS.VIDEO_SYNC, {
      youtubeId: room.youtubeId,
      videoTitle: room.currentVideoTitle,
      playbackState: room.playbackState,
      currentTime: currentCalculatedTime,
      videoQueue: room.videoQueue
    });
  });
};

export default registerPlaybackHandlers;
