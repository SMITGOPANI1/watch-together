import React from 'react';
import { Users, Play, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export const RoomsGrid = ({ rooms = [], onJoinRoom }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {rooms.length === 0 ? (
        <div className="sm:col-span-2 p-8 text-center text-xs text-slate-400 dark:text-gray-500 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-white/[0.01]">
          No active rooms available right now. Host your own to begin!
        </div>
      ) : (
        rooms.map((room) => (
          <Card
            key={room.id}
            variant="glow"
            className="flex flex-col gap-4 text-left glass-card-hover"
          >
            <div className="flex justify-between items-start gap-3">
              <Badge variant="primary">
                {room.category}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1 bg-slate-900/5 dark:bg-white/5 select-none">
                <Users className="w-3 h-3 text-brand-blue" />
                <span>{room.participantsCount}/{room.maxParticipants} online</span>
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">{room.name}</h4>
              <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">{room.description}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-black/40 border border-slate-150 dark:border-white/5 rounded-xl text-xs flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-brand-purple fill-brand-purple flex-shrink-0 animate-pulse" />
              <span className="text-slate-500 dark:text-gray-400 truncate">
                Playing: <strong className="text-slate-700 dark:text-white font-semibold">{room.currentVideoTitle}</strong>
              </span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <img
                  src={room.hostAvatar}
                  alt="Host"
                  className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-purple-950"
                />
                <span className="text-[10px] text-slate-400 dark:text-gray-500">Host: <strong className="text-slate-700 dark:text-white font-semibold">{room.hostName}</strong></span>
              </div>

              <Button
                variant="outline"
                onClick={() => onJoinRoom(room.id, room.name, room.category, room.hostName)}
                icon={ArrowRight}
                iconPosition="right"
                className="!px-3 !py-1.5 !text-[11px] cursor-pointer"
              >
                Join Party
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default RoomsGrid;
