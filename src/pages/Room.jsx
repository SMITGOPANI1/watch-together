import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Copy } from 'lucide-react';
import VideoPlayer from '../components/room/VideoPlayer';
import ChatSidebar from '../components/room/ChatSidebar';
import QueueSection from '../components/room/QueueSection';
import MembersList from '../components/room/MembersList';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { useStore } from '../context/StoreContext';
import { pageVariants } from '../animations/framer';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';
import { SOCKET_EVENTS } from '../constants/socketEvents';
import { messageService, roomService } from '../services/apiClient';
import { loadYouTubeAPI } from '../utils/youtubeLoader';

export const Room = () => {
  const { roomId } = useParams();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Reference global state store
  const {
    activeRoom,
    joinRoom,
    addChatMessage
  } = useStore();

  // Socket client & Auth hooks
  const { socket, connected, emit } = useSocket();
  const { currentUser } = useAuth();

  // Controlled Playback Local States
  const [localVideo, setLocalVideo] = useState({
    title: 'MKBHD - Apple Vision Pro Review: The Movie',
    youtubeId: 'dtp6b76pMak',
    duration: '29:12',
    thumbnail: 'https://img.youtube.com/vi/dtp6b76pMak/hqdefault.jpg'
  });
  const [localQueue, setLocalQueue] = useState([]);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('00:00');
  
  // Buffering, Syncing & Volume states
  const [isBuffering, setIsBuffering] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [inputText, setInputText] = useState('');
  const [queueInput, setQueueInput] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [reactions, setReactions] = useState([]);

  // Live WebSocket states
  const [chatMessages, setChatMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);

  // References
  const playerRef = useRef(null);
  const iframeReadyRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const chatEndRef = useRef(null);
  const roomStateRef = useRef({ playbackState: 'paused', currentTime: 0, lastUpdated: Date.now() });

  // 1. Fetch Room dynamic metadata on mount (Refresh & Late Join support)
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await roomService.getRoom(roomId || 'watchhive-demo');
        if (response.success && response.data) {
          const room = response.data;
          joinRoom(room.id, room.name, room.category, room.hostName);
          
          setLocalVideo({
            title: room.currentVideoTitle,
            youtubeId: room.youtubeId,
            duration: '29:12',
            thumbnail: `https://img.youtube.com/vi/${room.youtubeId}/hqdefault.jpg`
          });
          setLocalQueue(room.videoQueue || []);
          setLocalIsPlaying(room.playbackState === 'playing');
          roomStateRef.current = {
            playbackState: room.playbackState,
            currentTime: room.currentTime,
            lastUpdated: room.lastUpdated
          };
        } else {
          addToast('This room does not exist or has been closed.', 'error');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('[CLIENT ROOM FETCH ERROR]:', err);
        addToast('Connection to room failed.', 'error');
        navigate('/dashboard');
      }
    };

    if (roomId && (!activeRoom || activeRoom.id !== roomId)) {
      fetchRoomDetails();
    }
  }, [roomId, activeRoom, joinRoom, addToast, navigate]);

  // Load chat messages
  useEffect(() => {
    const fetchRoomMessages = async () => {
      try {
        const dbMsgs = await messageService.getMessages(roomId || 'watchhive-demo');
        setChatMessages(dbMsgs);
      } catch (err) {
        console.error('[CLIENT MESSAGES FETCH ERROR]:', err);
      }
    };
    fetchRoomMessages();
  }, [roomId]);

  // 2. Initialize YouTube Player dynamic API script
  useEffect(() => {
    let active = true;

    loadYouTubeAPI().then((YT) => {
      if (!active) return;

      // Clean up previous instance if it exists
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (destroyErr) {
          console.warn('[YT PLAYER]: Error destroying previous player instance:', destroyErr);
        }
      }

      // Re-create mount point element if it was deleted by destroy()
      let mountPoint = document.getElementById('youtube-player-mount');
      if (!mountPoint) {
        const container = document.getElementById('youtube-player-container');
        if (container) {
          mountPoint = document.createElement('div');
          mountPoint.id = 'youtube-player-mount';
          mountPoint.className = 'w-full h-full';
          container.appendChild(mountPoint);
        }
      }

      playerRef.current = new YT.Player('youtube-player-mount', {
        videoId: localVideo.youtubeId,
        playerVars: {
          autoplay: localIsPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            iframeReadyRef.current = true;
            event.target.setVolume(isMuted ? 0 : volume);
            
            // Late Join Sync: Seek to calculated Host position on load
            const state = roomStateRef.current;
            let targetSeek = state.currentTime;
            if (state.playbackState === 'playing') {
              const elapsed = (Date.now() - state.lastUpdated) / 1000;
              targetSeek += elapsed;
              event.target.loadVideoById(localVideo.youtubeId, targetSeek);
              event.target.playVideo();
            } else {
              event.target.cueVideoById(localVideo.youtubeId);
              event.target.seekTo(targetSeek, true);
              event.target.pauseVideo();
            }
          },
          onStateChange: (event) => {
            const state = event.data;
            if (state === YT.PlayerState.PLAYING) {
              setIsBuffering(false);
              setLocalIsPlaying(true);
            } else if (state === YT.PlayerState.PAUSED) {
              setLocalIsPlaying(false);
            } else if (state === YT.PlayerState.BUFFERING) {
              setIsBuffering(true);
            } else if (state === YT.PlayerState.ENDED) {
              setIsBuffering(false);
              setLocalIsPlaying(false);
              
              // Autoplay Next Video in Queue (Host only triggers this)
              const currentHostName = participants.find(p => p.isHost || p.role === 'Host')?.name || activeRoom?.hostName;
              const isUserHost = currentHostName === (currentUser?.username || currentUser?.name);
              
              if (isUserHost && localQueue.length > 0) {
                const nextVideo = localQueue[0];
                const updatedQueue = localQueue.slice(1);
                
                emit(SOCKET_EVENTS.VIDEO_CHANGE, {
                  roomId,
                  youtubeId: nextVideo.youtubeId,
                  videoTitle: nextVideo.title,
                  duration: nextVideo.duration
                });
                
                emit(SOCKET_EVENTS.QUEUE_UPDATE, {
                  roomId,
                  queue: updatedQueue
                });
                
                setLocalQueue(updatedQueue);
              }
            }
          }
        }
      });
    });

    return () => {
      active = false;
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [localVideo.youtubeId]);

  // Handle Mute & Volume updates dynamically on player
  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Establish and coordinate real-time room websocket hooks
  useEffect(() => {
    if (!socket) return;

    const handleJoin = () => {
      console.log(`[SOCKET CLIENT]: Sending join command for: ${roomId || 'watchhive-demo'}`);
      emit(SOCKET_EVENTS.ROOM_JOIN, { roomId: roomId || 'watchhive-demo' });
      // Ask for a state sync instantly
      emit(SOCKET_EVENTS.VIDEO_SYNC, { roomId: roomId || 'watchhive-demo' });
    };

    if (connected) {
      handleJoin();
    }

    socket.on('connect', handleJoin);

    const handleRoomUpdate = (data) => {
      console.log('[SOCKET CLIENT]: Room update details:', data);
      if (data.roomId === (roomId || 'watchhive-demo')) {
        const mapped = data.participants.map(p => ({
          id: p.userId || Math.random().toString(),
          name: p.name,
          avatar: p.avatar,
          role: p.role || 'Member',
          isHost: p.role === 'Host'
        }));
        setParticipants(mapped);
      }
    };

    const handleChatReceive = (msg) => {
      console.log('[SOCKET CLIENT]: Chat message packet:', msg);
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, {
          id: msg.id,
          userName: msg.sender?.name,
          avatar: msg.sender?.avatar,
          text: msg.message,
          timestamp: msg.timestamp,
          isHost: msg.isHost
        }];
      });
    };

    const handleTyping = (data) => {
      if (data.isTyping) {
        setTypingUser(data.userName);
      } else {
        setTypingUser(null);
      }
    };

    const handleNotification = (notification) => {
      addToast(notification.text, notification.type || 'info');
    };

    const handleRoomClosed = (data) => {
      console.log('[SOCKET CLIENT]: Room was closed by Host:', data);
      addToast(data.message, 'warning');
      navigate('/dashboard');
    };

    // Playback events listeners
    const handleVideoPlay = (data) => {
      console.log('[PLAYBACK SYNC]: Host played video at', data.currentTime);
      setLocalIsPlaying(true);
      roomStateRef.current = { playbackState: 'playing', currentTime: data.currentTime, lastUpdated: Date.now() };
      
      if (playerRef.current && playerRef.current.playVideo) {
        const localTime = playerRef.current.getCurrentTime() || 0;
        const drift = Math.abs(localTime - data.currentTime);
        if (drift > 1.5) {
          playerRef.current.seekTo(data.currentTime, true);
        }
        playerRef.current.playVideo();
      }
    };

    const handleVideoPause = (data) => {
      console.log('[PLAYBACK SYNC]: Host paused video at', data.currentTime);
      setLocalIsPlaying(false);
      roomStateRef.current = { playbackState: 'paused', currentTime: data.currentTime, lastUpdated: Date.now() };
      
      if (playerRef.current && playerRef.current.pauseVideo) {
        playerRef.current.pauseVideo();
        playerRef.current.seekTo(data.currentTime, true);
      }
    };

    const handleVideoSeek = (data) => {
      console.log('[PLAYBACK SYNC]: Host seeked video to', data.currentTime);
      roomStateRef.current.currentTime = data.currentTime;
      roomStateRef.current.lastUpdated = Date.now();
      
      if (playerRef.current && playerRef.current.seekTo) {
        playerRef.current.seekTo(data.currentTime, true);
      }
    };

    const handleVideoChange = (data) => {
      console.log('[PLAYBACK SYNC]: Host loaded video:', data.youtubeId);
      setLocalVideo({
        title: data.videoTitle,
        youtubeId: data.youtubeId,
        duration: data.duration || '05:00',
        thumbnail: `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`
      });
      setLocalIsPlaying(true);
      setProgress(0);
      setCurrentTimeStr('00:00');
      roomStateRef.current = { playbackState: 'playing', currentTime: 0, lastUpdated: Date.now() };
    };

    const handleQueueUpdate = (data) => {
      console.log('[PLAYBACK SYNC]: Shared queue updated:', data.queue);
      setLocalQueue(data.queue || []);
    };

    const handleVideoSync = (data) => {
      console.log('[PLAYBACK SYNC]: Syncing on request:', data);
      setLocalVideo({
        title: data.videoTitle,
        youtubeId: data.youtubeId,
        duration: '29:12',
        thumbnail: `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`
      });
      setLocalQueue(data.videoQueue || []);
      setLocalIsPlaying(data.playbackState === 'playing');
      
      roomStateRef.current = {
        playbackState: data.playbackState,
        currentTime: data.currentTime,
        lastUpdated: Date.now()
      };

      if (playerRef.current && playerRef.current.seekTo) {
        if (data.playbackState === 'playing') {
          playerRef.current.playVideo();
          const localTime = playerRef.current.getCurrentTime() || 0;
          if (Math.abs(localTime - data.currentTime) > 2.0) {
            playerRef.current.seekTo(data.currentTime, true);
          }
        } else {
          playerRef.current.seekTo(data.currentTime, true);
          playerRef.current.pauseVideo();
        }
      }
    };

    socket.on(SOCKET_EVENTS.ROOM_UPDATE, handleRoomUpdate);
    socket.on(SOCKET_EVENTS.CHAT_RECEIVE, handleChatReceive);
    socket.on(SOCKET_EVENTS.USER_TYPING, handleTyping);
    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNotification);
    socket.on(SOCKET_EVENTS.ROOM_CLOSED, handleRoomClosed);
    socket.on(SOCKET_EVENTS.VIDEO_PLAY, handleVideoPlay);
    socket.on(SOCKET_EVENTS.VIDEO_PAUSE, handleVideoPause);
    socket.on(SOCKET_EVENTS.VIDEO_SEEK, handleVideoSeek);
    socket.on(SOCKET_EVENTS.VIDEO_CHANGE, handleVideoChange);
    socket.on(SOCKET_EVENTS.QUEUE_UPDATE, handleQueueUpdate);
    socket.on(SOCKET_EVENTS.VIDEO_SYNC, handleVideoSync);

    return () => {
      console.log(`[SOCKET CLIENT]: Leaving room: ${roomId || 'watchhive-demo'}`);
      emit(SOCKET_EVENTS.ROOM_LEAVE, { roomId: roomId || 'watchhive-demo' });

      socket.off('connect', handleJoin);
      socket.off(SOCKET_EVENTS.ROOM_UPDATE, handleRoomUpdate);
      socket.off(SOCKET_EVENTS.CHAT_RECEIVE, handleChatReceive);
      socket.off(SOCKET_EVENTS.USER_TYPING, handleTyping);
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handleNotification);
      socket.off(SOCKET_EVENTS.ROOM_CLOSED, handleRoomClosed);
      socket.off(SOCKET_EVENTS.VIDEO_PLAY, handleVideoPlay);
      socket.off(SOCKET_EVENTS.VIDEO_PAUSE, handleVideoPause);
      socket.off(SOCKET_EVENTS.VIDEO_SEEK, handleVideoSeek);
      socket.off(SOCKET_EVENTS.VIDEO_CHANGE, handleVideoChange);
      socket.off(SOCKET_EVENTS.QUEUE_UPDATE, handleQueueUpdate);
      socket.off(SOCKET_EVENTS.VIDEO_SYNC, handleVideoSync);
    };
  }, [socket, connected, roomId, emit, addToast]);

  // Auto-scroll chat feed
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // 3. Playback timer & Progress bar update loop
  useEffect(() => {
    const ticker = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime && localIsPlaying) {
        const currentTime = playerRef.current.getCurrentTime() || 0;
        const duration = playerRef.current.getDuration() || 1;
        const calculatedPercent = (currentTime / duration) * 100;
        
        setProgress(calculatedPercent);

        const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
        const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
        setCurrentTimeStr(`${mins}:${secs}`);
      }
    }, 250);

    return () => clearInterval(ticker);
  }, [localIsPlaying]);

  // 4. Buffering & Drift Correction Engine (2s interval)
  useEffect(() => {
    const currentHostName = participants.find(p => p.isHost || p.role === 'Host')?.name || activeRoom?.hostName;
    const isUserHost = currentHostName === (currentUser?.username || currentUser?.name);
    
    if (!playerRef.current || !connected || isUserHost) return;

    const driftCorrection = setInterval(() => {
      const state = roomStateRef.current;
      if (state.playbackState !== 'playing' || isSyncing) return;

      const elapsed = (Date.now() - state.lastUpdated) / 1000;
      const expectedTime = state.currentTime + elapsed;

      const localTime = playerRef.current.getCurrentTime() || 0;
      const drift = Math.abs(localTime - expectedTime);

      // Auto-correct drift if desynced > 2.0s
      if (drift > 2.0) {
        console.warn(`[DRIFT DETECTED]: Local time is ${localTime}s, Expected Host time: ${expectedTime}s. Adjusting timeline...`);
        setIsSyncing(true);
        playerRef.current.seekTo(expectedTime, true);
        setTimeout(() => setIsSyncing(false), 500);
      }
    }, 2000);

    return () => clearInterval(driftCorrection);
  }, [participants, activeRoom, currentUser, connected, isSyncing]);

  // Host Action Handlers
  const currentHostName = participants.find(p => p.isHost || p.role === 'Host')?.name || activeRoom?.hostName || 'Smit Gopani';
  const isHost = participants.find(p => p.id === (currentUser?.uid || currentUser?.id))?.role === 'Host' || (activeRoom?.hostName === (currentUser?.username || currentUser?.name));

  const handleTogglePlay = () => {
    if (!isHost || !playerRef.current) return;
    const isNowPlaying = !localIsPlaying;
    setLocalIsPlaying(isNowPlaying);

    const currentTime = playerRef.current.getCurrentTime() || 0;
    if (isNowPlaying) {
      playerRef.current.playVideo();
      emit(SOCKET_EVENTS.VIDEO_PLAY, { roomId, currentTime });
    } else {
      playerRef.current.pauseVideo();
      emit(SOCKET_EVENTS.VIDEO_PAUSE, { roomId, currentTime });
    }
  };

  const handleScrub = (percent) => {
    if (!isHost || !playerRef.current) return;
    const duration = playerRef.current.getDuration() || 0;
    const seekSeconds = (percent / 100) * duration;
    playerRef.current.seekTo(seekSeconds, true);
    setProgress(percent);
    emit(SOCKET_EVENTS.VIDEO_SEEK, { roomId, currentTime: seekSeconds });
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    addToast('Synchronizing timeline with Host...', 'info');
    emit(SOCKET_EVENTS.VIDEO_SYNC, { roomId });
    setTimeout(() => {
      setIsSyncing(false);
      addToast('Timeline synchronized! ⚡', 'success');
    }, 1000);
  };

  const handleCloseRoom = () => {
    if (socket && connected) {
      console.log(`[SOCKET CLIENT]: Emitting ROOM_CLOSE for room: ${roomId}`);
      emit(SOCKET_EVENTS.ROOM_CLOSE, { roomId: roomId || 'watchhive-demo' });
    } else {
      addToast('Cannot connect to socket server to close room.', 'error');
    }
  };

  // Chat actions
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (socket && connected) {
      emit(SOCKET_EVENTS.CHAT_SEND, {
        roomId: roomId || 'watchhive-demo',
        text: inputText.trim()
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsCurrentlyTyping(false);
      emit(SOCKET_EVENTS.USER_TYPING, { roomId: roomId || 'watchhive-demo', isTyping: false });
    } else {
      addChatMessage(inputText.trim());
      addToast('Socket offline. Relay message locally.', 'warning');
    }
    
    setInputText('');
  };

  const handleSetInputText = (value) => {
    setInputText(value);

    if (socket && connected) {
      if (!isCurrentlyTyping && value.trim().length > 0) {
        setIsCurrentlyTyping(true);
        emit(SOCKET_EVENTS.USER_TYPING, { roomId: roomId || 'watchhive-demo', isTyping: true });
      } else if (value.trim().length === 0 && isCurrentlyTyping) {
        setIsCurrentlyTyping(false);
        emit(SOCKET_EVENTS.USER_TYPING, { roomId: roomId || 'watchhive-demo', isTyping: false });
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsCurrentlyTyping(false);
        emit(SOCKET_EVENTS.USER_TYPING, { roomId: roomId || 'watchhive-demo', isTyping: false });
      }, 1500);
    }
  };

  // Parsing dynamic YouTube URLs
  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url.trim();
  };

  const handleAddToQueue = async (e) => {
    e.preventDefault();
    if (!queueInput.trim()) {
      addToast('Please enter a YouTube video URL or ID!', 'warning');
      return;
    }

    const videoId = extractYoutubeId(queueInput);
    if (!videoId) {
      addToast('Invalid YouTube URL or ID.', 'error');
      return;
    }

    setQueueInput('');
    addToast('Video added to queue! 🍿', 'success');

    const videoTitle = `WatchHive Video (${videoId})`;
    const nextVideo = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: videoTitle,
      youtubeId: videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: '05:00',
      addedBy: currentUser?.username || currentUser?.name || 'Guest'
    };

    const updatedQueue = [...localQueue, nextVideo];
    setLocalQueue(updatedQueue);

    if (isHost) {
      emit(SOCKET_EVENTS.QUEUE_UPDATE, { roomId, queue: updatedQueue });
    }
  };

  const handlePlayFromQueue = (qId) => {
    if (!isHost) return;
    const video = localQueue.find((v) => v.id === qId);
    if (!video) return;

    const updatedQueue = localQueue.filter((v) => v.id !== qId);
    setLocalQueue(updatedQueue);

    emit(SOCKET_EVENTS.VIDEO_CHANGE, {
      roomId,
      youtubeId: video.youtubeId,
      videoTitle: video.title,
      duration: video.duration
    });
    
    emit(SOCKET_EVENTS.QUEUE_UPDATE, { roomId, queue: updatedQueue });
  };

  const handleRemoveFromQueue = (qId) => {
    const updatedQueue = localQueue.filter((v) => v.id !== qId);
    setLocalQueue(updatedQueue);
    addToast('Video removed from queue.', 'info');
    if (isHost) {
      emit(SOCKET_EVENTS.QUEUE_UPDATE, { roomId, queue: updatedQueue });
    }
  };

  const triggerReaction = (emoji) => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 + 10;
    setReactions((prev) => [...prev, { id, emoji, x }]);
    
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  const handleCopyInvite = () => {
    const inviteUrl = `${window.location.origin}/room/${roomId || 'watchhive-demo'}`;
    navigator.clipboard.writeText(inviteUrl);
    addToast('Invite link copied! Share with friends. 🔗', 'success');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(roomId || '');
    addToast('Room ID copied to clipboard! 📋', 'success');
  };

  const reactionEmojis = ["🔥", "💖", "😂", "🍿", "😮", "👏"];

  // Map messages dynamically
  const mappedChatMessages = chatMessages.map(msg => ({
    ...msg,
    isHost: msg.isHost !== undefined ? msg.isHost : msg.userName === currentHostName
  }));

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-[1600px] mx-auto px-4 sm:px-12 py-6 flex flex-col gap-6 relative min-h-[90vh]"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-all flex items-center justify-center focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="text-left">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span>Watch Room Session</span>
              <span className="bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple dark:text-brand-glow border border-brand-purple/20 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Live
              </span>
            </h1>
            <p className="text-xs text-slate-400 dark:text-gray-500 flex flex-wrap items-center gap-1.5 mt-0.5">
              <span>Room: {activeRoom?.name || 'Hive Study Session'}</span>
              <span className="text-slate-300 dark:text-white/10 select-none">•</span>
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 pl-2 pr-1 py-0.5 rounded font-mono text-[10px] select-all">
                <span>ID: {roomId}</span>
                <button
                  onClick={handleCopyId}
                  title="Copy Room ID"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-white/15 rounded text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </span>
            </p>
          </div>
        </div>

        {/* Share Invite */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="bg-white dark:bg-[#120B38]/30 border border-slate-200 dark:border-white/5 px-3.5 py-2 rounded-xl text-xs text-slate-500 dark:text-gray-400 font-mono hidden md:block select-all">
            {window.location.origin}/room/{roomId || 'watchhive-demo'}
          </div>
          <Button
            variant="primary"
            onClick={handleCopyInvite}
            icon={Share2}
            className="w-full sm:w-auto !px-4 !py-2 shadow-[0_0_15px_rgba(139,92,246,0.25)] text-xs cursor-pointer"
          >
            Copy Invite Link
          </Button>
          {isHost && (
            <Button
              variant="danger"
              onClick={handleCloseRoom}
              className="w-full sm:w-auto !px-4 !py-2 !text-xs cursor-pointer !bg-red-500/20 hover:!bg-red-500/30 !border-red-500/50"
            >
              Close Room
            </Button>
          )}
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side (Player and queue) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <VideoPlayer
            activeVideo={localVideo}
            isPlaying={localIsPlaying}
            togglePlay={handleTogglePlay}
            progress={progress}
            currentTimeStr={currentTimeStr}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            volume={volume}
            setVolume={setVolume}
            handleSyncTimeline={handleManualSync}
            reactions={reactions}
            isHost={isHost}
            handleScrub={handleScrub}
            isBuffering={isBuffering}
            isSyncing={isSyncing}
            connected={connected}
          />

          <QueueSection
            videoQueue={localQueue}
            queueInput={queueInput}
            setQueueInput={setQueueInput}
            handleAddToQueue={handleAddToQueue}
            handlePlayFromQueue={handlePlayFromQueue}
            handleRemoveFromQueue={handleRemoveFromQueue}
            isHost={isHost}
          />
        </div>

        {/* Right Side (Chat and active members list) */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          <ChatSidebar
            chatMessages={mappedChatMessages}
            inputText={inputText}
            setInputText={handleSetInputText}
            handleSendMessage={handleSendMessage}
            typingUser={typingUser}
            reactionEmojis={reactionEmojis}
            triggerReaction={triggerReaction}
            participantsCount={participants.length}
            chatEndRef={chatEndRef}
          />

          <MembersList
            users={participants}
            onInviteClick={handleCopyInvite}
          />
        </div>

      </div>
    </motion.div>
  );
};

export default Room;
