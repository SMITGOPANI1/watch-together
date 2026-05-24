import React from 'react';
import { cn } from '../../utils/cn';

export const Spinner = ({
  size = 'md', // sm, md, lg
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={cn(sizeClasses[size], "border-transparent border-t-brand-purple border-b-brand-blue rounded-full animate-spin")} />
      <div className={cn(sizeClasses[size], "absolute border-transparent border-t-brand-purple border-b-brand-blue rounded-full animate-spin opacity-50 blur-[4px]")} />
    </div>
  );
};
export default Spinner;
