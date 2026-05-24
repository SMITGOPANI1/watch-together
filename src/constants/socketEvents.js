export const SOCKET_EVENTS = {
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_UPDATE: 'room:update',
  ROOM_CLOSE: 'room:close',
  ROOM_CLOSED: 'room:closed',
  
  CHAT_SEND: 'chat:send',
  CHAT_RECEIVE: 'chat:receive',
  
  USER_TYPING: 'user:typing',
  
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  
  NOTIFICATION_NEW: 'notification:new',

  // Playback engine events
  VIDEO_PLAY: 'video:play',
  VIDEO_PAUSE: 'video:pause',
  VIDEO_SEEK: 'video:seek',
  VIDEO_STATE: 'video:state',
  VIDEO_SYNC: 'video:sync',
  VIDEO_CHANGE: 'video:change',
  QUEUE_UPDATE: 'queue:update',
  
  ERROR: 'socket:error'
};

export default SOCKET_EVENTS;
