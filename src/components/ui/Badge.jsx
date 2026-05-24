import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'primary', // primary, secondary, success, warning, danger
  className = '',
  ...props
}) => {
  const styles = {
    primary: 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple dark:text-brand-glow',
    secondary: 'bg-slate-900/5 dark:bg-white/5 border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-gray-400',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider select-none",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
