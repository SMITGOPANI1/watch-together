import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tv, ListMusic, Plus, ArrowRight, Sparkles, Compass } from 'lucide-react';
import StatsGrid from '../components/dashboard/StatsGrid';
import RoomsGrid from '../components/dashboard/RoomsGrid';
import PlaylistsGrid from '../components/dashboard/PlaylistsGrid';
import QuickActions from '../components/dashboard/QuickActions';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SkeletonCard, Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../hooks/useToast';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { roomService } from '../services/apiClient';
import { mockDashboardStats, mockPlaylists } from '../mock/mockData';
import { pageVariants } from '../animations/framer';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  
  // Playlist manager states
  const [playlists, setPlaylists] = useState(() => {
    const stored = localStorage.getItem('watchhive_playlists');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse playlists:', e);
      }
    }
    return [
      {
        id: "pl_1",
        name: "Cyberpunk Aesthetic Vibes",
        videosCount: 15,
        updatedAt: "2 days ago",
        thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "pl_2",
        name: "Next.js 15 & React Tutorials",
        videosCount: 8,
        updatedAt: "1 week ago",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "pl_3",
        name: "Space Documentary Marathon",
        videosCount: 12,
        updatedAt: "3 weeks ago",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
      }
    ];
  });
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistCategory, setPlaylistCategory] = useState('Cinema');

  // Form states
  const [roomName, setRoomName] = useState('');
  const [roomCategory, setRoomCategory] = useState('Cinema');
  const [joinRoomId, setJoinRoomId] = useState('');
  
  const { addToast } = useToast();
  const { joinRoom } = useStore();
  const { currentUser: user } = useAuth();
  const navigate = useNavigate();

  // Persist playlists
  useEffect(() => {
    localStorage.setItem('watchhive_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const playlistThumbnails = {
    Cinema: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80',
    Music: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
    Tech: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80',
    Gaming: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80'
  };

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!playlistName.trim()) {
      addToast('Please enter a playlist name!', 'warning');
      return;
    }

    const newPlaylist = {
      id: `pl_${Date.now()}`,
      name: playlistName.trim(),
      videosCount: 0,
      updatedAt: 'Just now',
      thumbnail: playlistThumbnails[playlistCategory] || playlistThumbnails.Cinema
    };

    setPlaylists((prev) => [newPlaylist, ...prev]);
    addToast(`Playlist "${playlistName}" created successfully! 🎶`, 'success');
    setPlaylistName('');
    setIsCreatePlaylistOpen(false);
  };

  const handleDeletePlaylist = (id) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
    addToast('Playlist removed successfully.', 'info');
  };

  // Construct dynamic stats mapping real Mongoose data from backend User profile
  const statsData = [
    {
      label: "Total Watch Time",
      value: user ? `${Math.floor(user.hoursWatched || 0)}h ${Math.round(((user.hoursWatched || 0) % 1) * 60)}m` : "0h 0m",
      change: "+12% this week",
      icon: "Clock"
    },
    {
      label: "Rooms Hosted",
      value: user ? (user.roomsHosted !== undefined ? user.roomsHosted : 0).toString() : "0",
      change: "Created by you",
      icon: "Tv"
    },
    {
      label: "Saved Playlists",
      value: playlists.length.toString(),
      change: `${playlists.length} created`,
      icon: "ListMusic"
    },
    {
      label: "Hive Friends",
      value: user ? (user.friends?.length || 0).toString() : "0",
      change: "No pending requests",
      icon: "Users"
    }
  ];

  // Load rooms via simulated API client
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getRooms();
        setRooms(data);
        setLoading(false);
      } catch (err) {
        addToast('Failed to fetch active rooms directory.', 'error');
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      addToast('Please enter a room name!', 'warning');
      return;
    }
    
    setIsCreateOpen(false);
    addToast('Spawning room in progress...', 'info');
    
    const response = await roomService.createRoom(roomName, roomCategory, false, user?.username || user?.name, user?.uid || user?.id);
    if (response.success) {
      addToast(`Room "${roomName}" created successfully! 🎉`, 'success');
      joinRoom(response.data.id, response.data.name, response.data.category);
      navigate(`/room/${response.data.id}`);
    } else {
      addToast(response.error, 'error');
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinRoomId.trim()) {
      addToast('Please enter a room ID!', 'warning');
      return;
    }
    setIsJoinOpen(false);
    addToast(`Joining Watch Room...`, 'info');
    joinRoom(joinRoomId.trim(), 'Watch Room');
    navigate(`/room/${joinRoomId.trim()}`);
  };

  const handleGridJoin = (id, name, cat, hostName) => {
    joinRoom(id, name, cat, hostName);
    navigate(`/room/${id}`);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col gap-8 w-full text-left"
    >
      {loading ? (
        /* SKELETON LOADER STATE */
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#120B38]/30 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-2.5 shadow-sm">
                <Skeleton variant="text" width="60%" className="h-4" />
                <Skeleton variant="text" width="40%" className="h-8" />
                <Skeleton variant="text" width="70%" className="h-3" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Skeleton variant="text" width="30%" className="h-7" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Skeleton variant="text" width="50%" className="h-7" />
              <div className="bg-white dark:bg-[#120B38]/30 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
                <Skeleton variant="rectangular" height="80px" />
                <Skeleton variant="rectangular" height="80px" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ACTIVE VIEW */
        <>
          {/* Stats indicators */}
          <StatsGrid stats={statsData} />

          {/* Core Widescreen Grids Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Rooms & Saved Playlists Column */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Active Watch Rooms */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-brand-purple animate-pulse" />
                    <span>Active Watch Rooms</span>
                  </h2>
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="text-xs font-bold text-brand-purple dark:text-brand-glow hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New</span>
                  </button>
                </div>

                <RoomsGrid rooms={rooms} onJoinRoom={handleGridJoin} />
              </div>

              {/* Playlists */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                    <ListMusic className="w-5 h-5 text-brand-blue animate-pulse" />
                    <span>Saved Playlists</span>
                  </h2>
                  <button
                    onClick={() => setIsCreatePlaylistOpen(true)}
                    className="text-xs font-bold text-brand-blue dark:text-brand-glow hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Playlist</span>
                  </button>
                </div>
                <PlaylistsGrid playlists={playlists} onDelete={handleDeletePlaylist} />
              </div>
            </div>

            {/* Quick Actions Panel Column */}
            <div className="lg:col-span-4 flex flex-col gap-8 w-full">
              <QuickActions
                onCreateClick={() => setIsCreateOpen(true)}
                onJoinClick={() => setIsJoinOpen(true)}
              />
            </div>

          </div>
        </>
      )}

      {/* CREATE ROOM MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create WatchHive Room"
        size="sm"
      >
        <form onSubmit={handleCreateRoom} className="flex flex-col gap-5">
          <Input
            label="Room Name"
            id="room-name-dash-refactored"
            placeholder="e.g. Smash trailers popcorn party! 🍿"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            icon={Sparkles}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-gray-400">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Cinema', 'Music', 'Tech', 'Gaming'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setRoomCategory(cat)}
                  className={`py-2 px-1 rounded-xl border text-[10px] font-bold tracking-wide transition-all focus:outline-none cursor-pointer ${
                    roomCategory === cat
                      ? 'bg-brand-purple/10 dark:bg-brand-purple/20 border-brand-purple text-brand-purple dark:text-brand-glow shadow-sm'
                      : 'bg-slate-950/[0.02] dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={Plus}
            className="w-full py-3.5 mt-2 cursor-pointer"
          >
            Create Hive Room
          </Button>
        </form>
      </Modal>

      {/* JOIN ROOM MODAL */}
      <Modal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        title="Join WatchHive Room"
        size="sm"
      >
        <form onSubmit={handleJoinRoom} className="flex flex-col gap-5">
          <Input
            label="Room ID"
            id="join-room-id-dash-refactored"
            placeholder="e.g. room_1 or copy ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            required
            icon={Compass}
          />

          <Button
            type="submit"
            variant="primary"
            icon={ArrowRight}
            className="w-full py-3.5 mt-2 cursor-pointer"
          >
            Join Watch Room
          </Button>
        </form>
      </Modal>

      {/* CREATE PLAYLIST MODAL */}
      <Modal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        title="Create Saved Playlist"
        size="sm"
      >
        <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-5">
          <Input
            label="Playlist Name"
            id="playlist-name-dash-refactored"
            placeholder="e.g. My Coding Chill Hits 🎧"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            required
            icon={Sparkles}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-gray-400">
              Style/Theme Preset
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Cinema', 'Music', 'Tech', 'Gaming'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPlaylistCategory(cat)}
                  className={`py-2 px-1 rounded-xl border text-[10px] font-bold tracking-wide transition-all focus:outline-none cursor-pointer ${
                    playlistCategory === cat
                      ? 'bg-brand-blue/10 dark:bg-brand-blue/20 border-brand-blue text-brand-blue dark:text-brand-glow shadow-sm'
                      : 'bg-slate-950/[0.02] dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={Plus}
            className="w-full py-3.5 mt-2 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.25)]"
          >
            Create Saved Playlist
          </Button>
        </form>
      </Modal>

    </motion.div>
  );
};

export default Dashboard;
