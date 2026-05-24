import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Play,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Compass,
  Star
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { useStore } from '../context/StoreContext';
import { mockTestimonials, mockFAQs } from '../mock/mockData';
import { pageVariants, staggerContainer, staggerItem } from '../animations/framer';

export const Landing = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [roomCategory, setRoomCategory] = useState('Cinema');
  const [activeFaq, setActiveFaq] = useState(null);
  
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
    navigate(`/room/${roomId}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinRoomId.trim()) {
      addToast('Please enter a Room ID!', 'warning');
      return;
    }
    setIsJoinOpen(false);
    addToast('Joining room session...', 'info');
    joinRoom(joinRoomId.trim(), 'Watch Room');
    navigate(`/room/${joinRoomId.trim()}`);
  };

  const landingFeatures = [
    { icon: Sparkles, title: "Real-Time Sync", desc: "Perfect low-latency stream synchronizations. Pausing or scrubbing is instantaneous." },
    { icon: Play, title: "Collaborative Queue", desc: "Collaborate on playlists in real-time. Drag and drop any YouTube ID to stream together." },
    { icon: Compass, title: "Immersive Rooms", desc: "Responsive 2-column social streaming spaces fitted with rich visual dark controls." }
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-[1600px] mx-auto px-6 sm:px-12 py-16 flex flex-col gap-24 relative"
    >
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[85vh]">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="self-start flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-purple dark:text-brand-glow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Watch Sync Reimagined</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-slate-800 dark:text-white">
            Watch YouTube Together <br />
            With <span className="bg-gradient-to-r from-brand-purple via-brand-glow to-brand-blue bg-clip-text text-transparent animate-pulse-glow">Friends</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-gray-400 leading-relaxed max-w-2xl">
            WatchHive synchronizes video streams, chats, and custom emoji reactions. Connect instantly with zero latency inside a stunning glassmorphic digital theater.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Button
              variant="primary"
              onClick={() => setIsCreateOpen(true)}
              icon={Plus}
              className="w-full sm:w-auto py-3.5 px-7 text-base shadow-[0_0_25px_rgba(139,92,246,0.25)] cursor-pointer"
            >
              Create Room
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsJoinOpen(true)}
              icon={Compass}
              className="w-full sm:w-auto py-3.5 px-7 text-base cursor-pointer"
            >
              Join Room
            </Button>
          </div>
        </div>

        {/* Floating card visual */}
        <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center">
          <div className="absolute w-72 h-72 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 blur-[80px] pointer-events-none animate-pulse-glow" />
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="w-full max-w-[420px]"
          >
            <Card variant="glow" className="p-4 border shadow-2xl relative z-10 animate-float text-left">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-wider ml-auto">Room: Hive-Lofi-🎧</span>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-white/5 bg-black flex items-center justify-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80"
                  alt="Mockup video"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-purple flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.8)]">
                    <Play className="w-5 h-5 fill-white text-white translate-x-[1px]" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2.5 items-start p-2 rounded-lg bg-slate-900/[0.01] dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                  <img
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=alice"
                    alt="Avatar"
                    className="w-7 h-7 rounded-full border border-brand-purple/30 bg-slate-200 dark:bg-purple-950"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">Alice Dev</span>
                      <Badge variant="primary" className="!text-[7px] !px-1.5 !py-0 select-none">Host</Badge>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-1 leading-snug">Wow! This sync is incredibly low latency. 🍿🚀</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="flex flex-col gap-12 text-center scroll-mt-24">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 dark:text-white">
            Designed For The Ultimate <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">Social Stream</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-gray-400">
            Enjoy full HD playback synchronization alongside rich social workspaces. WatchHive fits perfectly into your friend circle.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {landingFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div variants={staggerItem} key={feat.title}>
                <Card
                  variant="interactive"
                  className="text-left flex flex-col gap-4 h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-purple/10 dark:bg-brand-purple/20 border border-brand-purple/20 dark:border-brand-purple/30 flex items-center justify-center text-brand-purple dark:text-brand-glow shadow-inner">
                    <Icon className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="flex flex-col gap-12 text-center">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 dark:text-white">
            Approved By <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent font-black">Streamers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTestimonials.map((test) => (
            <Card
              key={test.id}
              variant="interactive"
              className="flex flex-col gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">{test.name}</h4>
                  <span className="text-xs text-slate-400 dark:text-gray-500">{test.username}</span>
                </div>
                <div className="flex items-center gap-0.5 ml-auto select-none">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-650 dark:text-gray-400 leading-relaxed font-medium">
                "{test.text}"
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs Accordion */}
      <section className="flex flex-col gap-12 max-w-3xl mx-auto w-full scroll-mt-24 text-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 dark:text-white">
            Frequently Asked <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">Questions</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4 text-left">
          {mockFAQs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <Card
                key={idx}
                variant="default"
                className="!p-0 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 font-semibold text-sm sm:text-base text-slate-800 dark:text-white hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01] transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-left">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400 leading-relaxed border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </section>

      {/* MODALS CREATE/JOIN */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create WatchHive Room"
        size="sm"
      >
        <form onSubmit={handleCreateRoom} className="flex flex-col gap-5">
          <Input
            label="Room Name"
            id="room-name-landing-refactored"
            placeholder="e.g. Popcorn reaction night! 🍿"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            icon={Sparkles}
          />
          <Button
            type="submit"
            variant="primary"
            icon={Plus}
            className="w-full py-3.5 cursor-pointer"
          >
            Create Hive Room
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        title="Join WatchHive Room"
        size="sm"
      >
        <form onSubmit={handleJoinRoom} className="flex flex-col gap-5">
          <Input
            label="Room Link or ID"
            id="join-room-id-landing-refactored"
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
            className="w-full py-3.5 cursor-pointer"
          >
            Join Room Session
          </Button>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Landing;
