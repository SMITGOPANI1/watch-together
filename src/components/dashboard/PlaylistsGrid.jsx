import React from 'react';
import { Play, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const PlaylistsGrid = ({ playlists = [], onDelete }) => {
  if (playlists.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 dark:text-gray-500 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl select-none bg-slate-950/[0.01] dark:bg-white/[0.01]">
        No playlists saved. Click "Create Playlist" above to make your first custom playlist!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {playlists.map((pl) => (
        <div
          key={pl.id}
          className={cn(
            "rounded-2xl overflow-hidden border transition-all duration-300 relative flex flex-col group cursor-pointer",
            "bg-white border-slate-200 shadow-sm",
            "dark:bg-white/[0.02] dark:border-white/5 dark:shadow-2xl",
            "hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]"
          )}
        >
          {/* Delete Button (Visible on Hover) */}
          <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete the playlist "${pl.name}"?`)) {
                  onDelete(pl.id);
                }
              }}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-500 dark:text-red-400 transition-all cursor-pointer focus:outline-none"
              title="Delete Playlist"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative aspect-video overflow-hidden">
            <img
              src={pl.thumbnail}
              alt="Playlist Thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 bg-slate-100 dark:bg-slate-900"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center text-white shadow-lg">
                <Play className="w-4.5 h-4.5 fill-white translate-x-[0.5px]" />
              </div>
            </div>
          </div>

          <div className="p-4 flex-grow flex flex-col gap-1.5 text-left">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-brand-purple dark:group-hover:text-brand-glow transition-colors truncate">{pl.name}</h4>
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-gray-500 font-semibold mt-auto pt-2 border-t border-slate-50 dark:border-white/5">
              <span>{pl.videosCount} Videos</span>
              <span>Updated {pl.updatedAt}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistsGrid;
