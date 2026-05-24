import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, RefreshCw, Tv, Wifi, WifiOff, Loader2 } from 'lucide-react';

export const VideoPlayer = ({
  activeVideo,
  isPlaying,
  togglePlay,
  progress,
  currentTimeStr,
  isMuted,
  setIsMuted,
  volume,
  setVolume,
  handleSyncTimeline,
  reactions = [],
  isHost = false,
  handleScrub = () => {},
  isBuffering = false,
  isSyncing = false,
  connected = true
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-brand-purple/15 bg-black shadow-2xl z-10 group">
      {/* Actual YouTube Player Mount Point Container */}
      <div id="youtube-player-container" className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <div id="youtube-player-mount" className="w-full h-full" />
      </div>

      {/* Invisible Overlay to block player interactions for Viewers, while allowing Host interactions through controls */}
      <div className="absolute inset-0 z-10 bg-transparent" />

      {/* Cinematic Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-20" />

      {/* BUFFERING / SYNCING / LOADING OVERLAY */}
      <AnimatePresence>
        {(isBuffering || isSyncing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30 pointer-events-none select-none"
          >
            <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-200 animate-pulse">
              {isSyncing ? 'Synchronizing Stream...' : 'Buffering Video...'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING REACTIONS CANVAS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
        <AnimatePresence>
          {reactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ y: 250, x: `${r.x}%`, opacity: 1, scale: 0.8 }}
              animate={{ y: -30, opacity: 0, scale: 1.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className="absolute text-4xl select-none"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Header Banner Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-semibold flex items-center gap-2 text-white shadow-lg pointer-events-none z-30 select-none">
        <Tv className="w-4 h-4 text-brand-purple animate-pulse" />
        <span className="truncate max-w-[200px] sm:max-w-xs">Streaming: {activeVideo.title}</span>
      </div>

      {/* Synced Control Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col gap-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        {/* Timeline scrubber bar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-300 font-bold font-mono select-none">{currentTimeStr}</span>
          <input
            type="range"
            min="0"
            max="100"
            step="0.01"
            value={progress}
            disabled={!isHost} // READ-ONLY for guest viewers!
            onChange={(e) => handleScrub(Number(e.target.value))}
            className="flex-grow h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none bg-white/20 accent-brand-purple hover:accent-brand-glow transition-all disabled:opacity-85 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #3b82f6 ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
          <span className="text-[10px] text-gray-400 font-bold font-mono select-none">{activeVideo.duration}</span>
        </div>

        {/* Action row controls */}
        <div className="flex items-center justify-between gap-4 text-white select-none">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            {isHost ? (
              <button
                onClick={togglePlay}
                className="p-1 text-gray-300 hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>
            ) : (
              <div className="p-1 text-slate-500 cursor-not-allowed" title="Playback locked by Host">
                {isPlaying ? <Pause className="w-5 h-5 opacity-40" /> : <Play className="w-5 h-5 opacity-40" />}
              </div>
            )}

            {/* Sync timeline */}
            <button
              onClick={handleSyncTimeline}
              className="p-1 text-gray-300 hover:text-brand-glow transition-colors focus:outline-none flex items-center gap-1.5 cursor-pointer"
              title="Resync to Host"
            >
              <motion.div whileTap={{ rotate: 180 }} transition={{ duration: 0.4 }}>
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest hidden sm:inline">Sync</span>
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 text-gray-300 hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer focus:outline-none accent-brand-purple"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection badge */}
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 border ${
              connected 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
            }`}>
              {connected ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span>Synchronized</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-red-400" />
                  <span>Offline</span>
                </>
              )}
            </span>

            {/* Host Status indicator */}
            <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple dark:text-brand-glow">
              {isHost ? 'Host controls' : 'Viewer mode'}
            </span>

            <button
              onClick={() => {
                const el = document.getElementById('youtube-player-mount');
                if (el?.requestFullscreen) el.requestFullscreen();
              }}
              className="p-1 text-gray-300 hover:text-white transition-colors focus:outline-none cursor-pointer"
              title="Fullscreen"
            >
              <Maximize className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
