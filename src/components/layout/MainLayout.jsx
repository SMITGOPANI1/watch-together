import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { useStore } from '../../context/StoreContext';
import { ToggleLeft, ToggleRight, Sparkles, Users } from 'lucide-react';

export const MainLayout = ({ children }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomCategory, setRoomCategory] = useState('Cinema');
  const { addToast } = useToast();
  const { joinRoom } = useStore();
  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      addToast('Please enter a room name!', 'warning');
      return;
    }
    
    setIsCreateOpen(false);
    const roomId = 'room_' + Math.random().toString(36).substr(2, 9);
    addToast(`Room "${roomName}" created successfully! 🎉`, 'success');
    joinRoom(roomId, roomName, roomCategory);
    setRoomName('');
    setIsPrivate(false);
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#030014] dark:text-gray-100 transition-colors duration-500">
      {/* Background Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full radial-glow-1 blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-100" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full radial-glow-2 blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-100" />

      {/* Global Navbar */}
      <Navbar onCreateRoomClick={() => setIsCreateOpen(true)} />

      {/* Main page content wrapper */}
      <main className="flex-grow pt-24 z-10">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Create Room Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create WatchHive Room"
        size="sm"
      >
        <form onSubmit={handleCreateRoom} className="flex flex-col gap-5">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Set up your synchronized streaming space. Invite friends, share live chat, and control videos together!
          </p>

          <Input
            label="Room Name"
            id="room-name-global"
            placeholder="e.g. Popcorn trailer reaction night! 🍿"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            icon={Sparkles}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
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

          <div className="flex items-center justify-between p-3.5 bg-slate-950/[0.01] dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl text-left">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Private Room</h4>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Only friends with the invite link can enter.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className="text-brand-purple transition-transform duration-200 active:scale-95 focus:outline-none cursor-pointer"
            >
              {isPrivate ? (
                <ToggleRight className="w-9 h-9 text-brand-purple" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-slate-300 dark:text-gray-600" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={Users}
            className="w-full py-3.5 mt-2 cursor-pointer"
          >
            Create Hive Room
          </Button>
        </form>
      </Modal>
    </div>
  );
};
export default MainLayout;
