import React from 'react';
import { Plus, Compass, Sparkles } from 'lucide-react';
import Card from '../ui/Card';

export const QuickActions = ({ onCreateClick, onJoinClick }) => {
  return (
    <Card className="flex flex-col gap-4 text-left">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 flex items-center gap-2">
        <Sparkles className="w-4.5 h-4.5 text-brand-purple" />
        <span>Quick Actions</span>
      </h3>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={onCreateClick}
          className="w-full flex items-center justify-between p-3.5 bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 rounded-xl font-bold text-xs text-brand-purple dark:text-brand-glow transition-all duration-300 text-left active:scale-[0.98] focus:outline-none cursor-pointer"
        >
          <span>Create Watch Room</span>
          <Plus className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onJoinClick}
          className="w-full flex items-center justify-between p-3.5 bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:bg-slate-900/[0.05] dark:hover:bg-white/5 rounded-xl font-bold text-xs text-slate-700 dark:text-white transition-all duration-300 text-left active:scale-[0.98] focus:outline-none cursor-pointer"
        >
          <span>Join By Room ID</span>
          <Compass className="w-4.5 h-4.5 text-slate-400 dark:text-gray-500" />
        </button>
      </div>
    </Card>
  );
};

export default QuickActions;
