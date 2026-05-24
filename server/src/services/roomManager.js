class RoomManager {
  constructor() {
    // Start with a clean, empty map of active rooms. Seed rooms are fully removed.
    this.rooms = new Map();
  }

  // Get all public active rooms
  getAllRooms() {
    return Array.from(this.rooms.values()).filter((room) => !room.isPrivate);
  }

  // Find dynamic room metadata
  getRoom(id) {
    return this.rooms.get(id) || null;
  }

  // Instantiate room
  createRoom(name, category = 'Cinema', isPrivate = false, hostName = 'Host Pro', hostId = '') {
    const id = `room_${Math.random().toString(36).substr(2, 9)}`;
    const newRoom = {
      id,
      name,
      category,
      isPrivate,
      hostName,
      hostId,
      participantsCount: 1,
      maxParticipants: 15,
      currentVideoTitle: 'MKBHD - Apple Vision Pro Review: The Movie',
      youtubeId: 'dtp6b76pMak',
      playbackState: 'paused',
      currentTime: 0,
      lastUpdated: Date.now(),
      videoQueue: [],
      participants: [
        {
          name: hostName,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(hostName)}`,
          role: 'Host'
        }
      ]
    };

    this.rooms.set(id, newRoom);
    return newRoom;
  }

  // Explicit close room handler
  closeRoom(roomId) {
    if (this.rooms.has(roomId)) {
      this.rooms.delete(roomId);
      return true;
    }
    return false;
  }

  // Simulated join room handler
  joinRoom(roomId, userName) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Check if already in room
    const exists = room.participants.some((p) => p.name === userName);
    if (!exists) {
      room.participants.push({
        name: userName,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userName)}`,
        role: 'Member'
      });
      room.participantsCount = room.participants.length;
    }

    return room;
  }

  // Simulated leave room handler
  leaveRoom(roomId, userName) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.participants = room.participants.filter((p) => p.name !== userName);
    room.participantsCount = room.participants.length;

    // If room is empty, clean it up
    if (room.participantsCount === 0) {
      this.rooms.delete(roomId);
      return { destroyed: true };
    }

    return room;
  }

  // Update dynamic playback state
  updatePlaybackState(roomId, isPlaying, currentTime) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.playbackState = isPlaying ? 'playing' : 'paused';
    room.currentTime = Number(currentTime) || 0;
    room.lastUpdated = Date.now();
    return room;
  }

  // Update dynamic video seek position
  updatePlaybackSeek(roomId, currentTime) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.currentTime = Number(currentTime) || 0;
    room.lastUpdated = Date.now();
    return room;
  }

  // Swap active video details
  changeVideo(roomId, youtubeId, videoTitle, duration = '00:00') {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.youtubeId = youtubeId;
    room.currentVideoTitle = videoTitle;
    room.playbackState = 'playing';
    room.currentTime = 0;
    room.lastUpdated = Date.now();
    return room;
  }

  // Update dynamic room queue
  updateQueue(roomId, queue) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.videoQueue = queue || [];
    return room;
  }
}

export const roomManager = new RoomManager();
export default roomManager;
