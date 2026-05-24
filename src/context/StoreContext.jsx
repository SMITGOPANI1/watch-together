import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers, mockChatMessages, mockQueue } from '../mock/mockData';

const StoreContext = createContext(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  // Global States
  const [user, setUserState] = useState({
    name: 'Smit Gopani',
    email: 'smit@watchhive.com',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=smit',
    level: 'Host Pro',
    levelValue: 78,
    hoursWatched: 48.5,
    roomsHosted: 24,
  });

  const [activeRoom, setActiveRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState(mockChatMessages);
  const [videoQueue, setVideoQueue] = useState(mockQueue);
  const [notifications, setNotifications] = useState([
    { id: 'not_1', text: 'Welcome back, Smit!', read: false },
    { id: 'not_2', text: 'Alice is hosting Lo-Fi beats.', read: true },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVideo, setActiveVideo] = useState({
    title: "MKBHD - Apple Vision Pro Review: The Movie",
    youtubeId: "dtp6b76pMak",
    duration: "29:12",
    thumbnail: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80"
  });

  // Actions
  const updateUser = useCallback((fields) => {
    setUserState((prev) => ({ ...prev, ...fields }));
  }, []);

  const joinRoom = useCallback((roomId, roomName, category = 'Cinema', hostName = 'Smit Gopani') => {
    setActiveRoom({
      id: roomId,
      name: roomName,
      category,
      hostName,
      participants: mockUsers,
    });
    // Set default initial room conditions
    setChatMessages(mockChatMessages);
    setVideoQueue(mockQueue);
    setIsPlaying(false);
  }, []);

  const leaveRoom = useCallback(() => {
    setActiveRoom(null);
  }, []);

  const addChatMessage = useCallback((text) => {
    const newMsg = {
      id: 'msg_' + Date.now(),
      userId: 'user_1',
      userName: user.name,
      avatar: user.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isHost: true,
    };
    setChatMessages((prev) => [...prev, newMsg]);
  }, [user]);

  const queueVideo = useCallback((title) => {
    const newVideo = {
      id: 'q_' + Date.now(),
      title,
      duration: "05:40",
      addedBy: user.name,
      youtubeId: "dtp6b76pMak",
      thumbnail: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=400&q=80",
    };
    setVideoQueue((prev) => [...prev, newVideo]);
  }, [user]);

  const playVideoFromQueue = useCallback((id) => {
    const video = videoQueue.find((v) => v.id === id);
    if (!video) return;

    setActiveVideo({
      title: video.title,
      duration: video.duration,
      youtubeId: video.youtubeId,
      thumbnail: video.thumbnail,
    });

    setVideoQueue((prev) => prev.filter((v) => v.id !== id));
    setIsPlaying(true);
  }, [videoQueue]);

  const removeFromQueue = useCallback((id) => {
    setVideoQueue((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const togglePlay = useCallback((state) => {
    setIsPlaying((prev) => (state !== undefined ? state : !prev));
  }, []);

  const addNotification = useCallback((text) => {
    setNotifications((prev) => [
      { id: 'not_' + Date.now(), text, read: false },
      ...prev,
    ]);
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        user,
        activeRoom,
        chatMessages,
        videoQueue,
        notifications,
        isPlaying,
        activeVideo,
        updateUser,
        joinRoom,
        leaveRoom,
        addChatMessage,
        queueVideo,
        playVideoFromQueue,
        removeFromQueue,
        togglePlay,
        addNotification,
        markNotificationsRead,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
