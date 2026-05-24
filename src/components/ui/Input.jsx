import React from 'react';
import { cn } from '../../utils/cn';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-gray-500 pointer-events-none">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full bg-slate-900/[0.01] dark:bg-white/[0.02] border rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300",
            Icon ? "pl-11" : "",
            error
              ? "border-red-500/40 focus:border-red-500/80 focus:ring-red-500/20"
              : "border-slate-200 dark:border-white/10 focus:border-brand-purple/60 focus:ring-brand-purple/20"
          )}
          {...props}
        />
      </div>
      
      {error && (
        <span className="text-xs text-red-500 dark:text-red-400 font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};
export default Input;
