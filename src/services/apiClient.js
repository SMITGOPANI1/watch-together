let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
if (rawBaseUrl && !rawBaseUrl.includes('/api/v1')) {
  // Automatically append /api/v1 if not present in the hosting environment variable
  rawBaseUrl = rawBaseUrl.endsWith('/') ? `${rawBaseUrl}api/v1` : `${rawBaseUrl}/api/v1`;
}
const BASE_URL = rawBaseUrl;

// Reusable fetch wrapper that injects Firebase Auth tokens
const makeRequest = async (path, options = {}) => {
  const token = localStorage.getItem('watchhive_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    data = { message: text || 'Raw server message parsing failed.' };
  }

  if (!response.ok) {
    return {
      success: false,
      error: data.message || 'Network request failed',
      errors: data.errors || null
    };
  }

  return {
    success: true,
    ...data
  };
};

export const apiClient = {
  get: (endpoint) => makeRequest(endpoint, { method: 'GET' }),
  post: (endpoint, payload) => makeRequest(endpoint, { method: 'POST', body: JSON.stringify(payload) }),
  patch: (endpoint, payload) => makeRequest(endpoint, { method: 'PATCH', body: JSON.stringify(payload) }),
};

export const roomService = {
  getRooms: async () => {
    const res = await apiClient.get('/rooms');
    if (res.success) {
      return res.data?.rooms || [];
    }
    // Fallback seed list to prevent crashes during connection losses
    const { mockRecentRooms } = await import('../mock/mockData');
    return [...mockRecentRooms];
  },
  
  createRoom: async (name, category = "Cinema", isPrivate = false, hostName = "Smit Gopani", hostId = "") => {
    const res = await apiClient.post('/rooms', { name, category, isPrivate, hostName, hostId });
    if (res.success) {
      return { success: true, data: res.data?.room };
    }
    return { success: false, error: res.error };
  },

  getRoom: async (roomId) => {
    const res = await apiClient.get(`/rooms/${roomId}`);
    if (res.success) {
      return { success: true, data: res.data?.room };
    }
    return { success: false, error: res.error };
  },

  joinRoom: async (roomId, userName) => {
    const res = await apiClient.post(`/rooms/${roomId}/join`, { userName });
    if (res.success) {
      return { success: true, data: res.data?.room };
    }
    return { success: false, error: res.error };
  },

  leaveRoom: async (roomId, userName) => {
    const res = await apiClient.post(`/rooms/${roomId}/leave`, { userName });
    if (res.success) {
      return { success: true, data: res.data?.room };
    }
    return { success: false, error: res.error };
  }
};

export const messageService = {
  getMessages: async (roomId) => {
    const res = await apiClient.get(`/messages/${roomId}`);
    if (res.success) {
      return res.data?.messages || [];
    }
    return [];
  }
};

export const authService = {
  syncUser: async () => {
    const res = await apiClient.post('/auth/sync-user', {});
    return res;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res;
  },

  updateProfile: async (name, email, avatar, bio) => {
    const res = await apiClient.patch('/users/profile', { name, email, avatar, bio });
    return res;
  }
};
export default apiClient;
