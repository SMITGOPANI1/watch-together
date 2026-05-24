import React from 'react';
import { Clock, Tv, ListMusic, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

export const StatsGrid = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        let Icon = Clock;
        if (idx === 1) Icon = Tv;
        if (idx === 2) Icon = ListMusic;
        if (idx === 3) Icon = Users;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card variant="default" className="text-left flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className="p-1.5 rounded-lg bg-slate-900/5 dark:bg-white/5 text-brand-purple dark:text-brand-glow">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{stat.value}</h3>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 animate-pulse" />
                {stat.change}
              </span>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
