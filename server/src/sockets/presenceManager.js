import roomManager from '../services/roomManager.js';

class PresenceManager {
  constructor() {
    // Maps roomId -> Map(userId -> { user, socketIds: Set(socketId) })
    this.roomParticipants = new Map();
    // Maps socketId -> { roomId, userId } for quick disconnect lookups
    this.socketRegistry = new Map();
  }

  // Adds a user's socket connection to a room
  addUserToRoom(roomId, user, socketId) {
    const userId = user.firebaseUid || (user.id || user._id)?.toString();

    if (!this.roomParticipants.has(roomId)) {
      this.roomParticipants.set(roomId, new Map());
    }

    const participantsMap = this.roomParticipants.get(roomId);

    if (!participantsMap.has(userId)) {
      const room = roomManager.getRoom(roomId);
      // Determine host role case-sensitively by hostId if available, or fall back to case-sensitive hostName comparison
      const isHost = room 
        ? (room.hostId ? room.hostId === userId : room.hostName === (user.username || user.name))
        : (participantsMap.size === 0);

      participantsMap.set(userId, {
        name: user.username || user.name,
        avatar: user.avatar,
        role: isHost ? 'Host' : 'Member',
        userId,
        socketIds: new Set([socketId])
      });
    } else {
      participantsMap.get(userId).socketIds.add(socketId);
    }

    // Register socket connection for quick lookups on disconnect
    this.socketRegistry.set(socketId, { roomId, userId });

    return this.getRoomParticipants(roomId);
  }

  // Removes a user's socket connection from a room
  removeUserFromRoom(roomId, userId, socketId) {
    this.socketRegistry.delete(socketId);

    const participantsMap = this.roomParticipants.get(roomId);
    if (!participantsMap) return [];

    const userPresence = participantsMap.get(userId);
    if (userPresence) {
      userPresence.socketIds.delete(socketId);
      
      // If no active sockets remain for this user, delete their presence completely
      if (userPresence.socketIds.size === 0) {
        participantsMap.delete(userId);
      }
    }

    // Clean up room completely if empty
    if (participantsMap.size === 0) {
      this.roomParticipants.delete(roomId);
      return [];
    }

    return this.getRoomParticipants(roomId);
  }

  // Cleans up a disconnecting socket ID
  handleSocketDisconnect(socketId) {
    const registration = this.socketRegistry.get(socketId);
    if (!registration) return null;

    const { roomId, userId } = registration;
    const remainingParticipants = this.removeUserFromRoom(roomId, userId, socketId);

    return {
      roomId,
      userId,
      remainingParticipants
    };
  }

  // Returns a flat list of active users in a room
  getRoomParticipants(roomId) {
    const participantsMap = this.roomParticipants.get(roomId);
    if (!participantsMap) return [];

    return Array.from(participantsMap.values()).map((p) => ({
      name: p.name,
      avatar: p.avatar,
      role: p.role,
      userId: p.userId
    }));
  }
}

export const presenceManager = new PresenceManager();
export default presenceManager;
