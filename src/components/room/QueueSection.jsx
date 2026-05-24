import React from 'react';
import { Plus, Trash2, Play } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export const QueueSection = ({
  videoQueue = [],
  queueInput,
  setQueueInput,
  handleAddToQueue,
  handlePlayFromQueue,
  handleRemoveFromQueue,
  isHost = false
}) => {
  return (
    <div className="bg-white dark:bg-[#120B38]/30 border border-slate-200 dark:border-white/5 p-5 rounded-2xl text-left flex flex-col gap-4 shadow-sm dark:shadow-2xl">
      <div className="flex items-center justify-between select-none">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 flex items-center gap-2">
          <Plus className="w-4.5 h-4.5 text-brand-purple" />
          <span>Collaborative Video Queue ({videoQueue.length})</span>
        </h3>
      </div>

      {/* Add to queue form */}
      <form onSubmit={handleAddToQueue} className="flex gap-2">
        <Input
          id="queue-input-component"
          placeholder="Paste YouTube video URL (e.g., https://www.youtube.com/watch?v=...) or video ID..."
          value={queueInput}
          onChange={(e) => setQueueInput(e.target.value)}
          className="!py-2 text-xs"
          required
        />
        <Button
          type="submit"
          variant="secondary"
          icon={Plus}
          className="!px-4 flex-shrink-0 text-xs cursor-pointer"
        >
          Queue
        </Button>
      </form>

      {/* Queue listing */}
      <div className="flex flex-col gap-2.5 mt-2 max-h-[220px] overflow-y-auto pr-1">
        {videoQueue.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 dark:text-gray-500 border border-dashed border-slate-200 dark:border-white/5 rounded-xl select-none">
            No upcoming videos in queue. Paste a URL to queue next!
          </div>
        ) : (
          videoQueue.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-900/[0.01] dark:bg-white/[0.01] hover:bg-slate-900/[0.02] dark:hover:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt="Thumbnail"
                  className="w-12 h-8 rounded object-cover border border-slate-200 dark:border-white/10 flex-shrink-0 bg-slate-100 dark:bg-slate-900 select-none pointer-events-none"
                />
                <div className="overflow-hidden text-left">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-gray-500 font-semibold mt-1 select-none">
                    <span>Dur: {item.duration}</span>
                    <span>•</span>
                    <span>Added by: <strong className="text-slate-700 dark:text-gray-400 font-medium">{item.addedBy}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {isHost && (
                  <Button
                    variant="primary"
                    onClick={() => handlePlayFromQueue(item.id)}
                    icon={Play}
                    className="!px-2.5 !py-1 !text-[10px] cursor-pointer"
                  >
                    Play Now
                  </Button>
                )}
                
                {(isHost || item.addedBy === 'Me') && (
                  <button
                    onClick={() => handleRemoveFromQueue(item.id)}
                    title="Remove from queue"
                    className="p-1.5 text-slate-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-450 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-red-500/5 dark:hover:bg-red-500/5 transition-all focus:outline-none cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueueSection;
