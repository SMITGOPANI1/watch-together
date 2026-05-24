// Centralized Socket.IO Event Name constants for WatchHive
export const SOCKET_EVENTS = {
  // Room presence events
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_UPDATE: 'room:update',
  ROOM_CLOSE: 'room:close',
  ROOM_CLOSED: 'room:closed',
  
  // Realtime messaging chat events
  CHAT_SEND: 'chat:send',
  CHAT_RECEIVE: 'chat:receive',
  
  // Typing indicators
  USER_TYPING: 'user:typing',
  
  // Online / Offline states
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  
  // Realtime system notifications
  NOTIFICATION_NEW: 'notification:new',

  // Playback engine events
  VIDEO_PLAY: 'video:play',
  VIDEO_PAUSE: 'video:pause',
  VIDEO_SEEK: 'video:seek',
  VIDEO_STATE: 'video:state',
  VIDEO_SYNC: 'video:sync',
  VIDEO_CHANGE: 'video:change',
  QUEUE_UPDATE: 'queue:update',
  
  // Standard error channels
  ERROR: 'socket:error'
};

export default SOCKET_EVENTS;
