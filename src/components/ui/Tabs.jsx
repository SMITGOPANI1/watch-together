import React from 'react';
import { cn } from '../../utils/cn';

export const Tabs = ({
  tabs = [], // [{ id, label, icon }]
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={cn("flex border border-slate-200 dark:border-white/5 bg-slate-900/[0.02] dark:bg-white/[0.01] p-1 rounded-xl w-full max-w-md select-none", className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-grow flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 focus:outline-none",
              isActive
                ? "bg-white dark:bg-brand-purple/20 text-brand-purple dark:text-brand-glow shadow-sm dark:shadow-[0_0_12px_rgba(139,92,246,0.2)] border border-slate-100 dark:border-brand-purple/20"
                : "text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white"
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
