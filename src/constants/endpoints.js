export const API_BASE_URL = 'https://api.watchhive.com/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },
  ROOMS: {
    LIST: '/rooms',
    CREATE: '/rooms/create',
    DETAILS: (id) => `/rooms/${id}`,
    JOIN: (id) => `/rooms/${id}/join`,
    LEAVE: (id) => `/rooms/${id}/leave`,
  },
  QUEUE: {
    ADD: (roomId) => `/rooms/${roomId}/queue/add`,
    REMOVE: (roomId, videoId) => `/rooms/${roomId}/queue/remove/${videoId}`,
    SYNC: (roomId) => `/rooms/${roomId}/queue/sync`,
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    PLAYLISTS: '/user/playlists',
  }
};
