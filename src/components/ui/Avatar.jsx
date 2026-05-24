import React from 'react';
import { cn } from '../../utils/cn';

export const Avatar = ({
  src,
  alt = 'User Avatar',
  size = 'md', // xs, sm, md, lg, xl
  status = null, // online, offline, idle
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-300 dark:bg-gray-500',
    idle: 'bg-amber-500',
  };

  const badgeSize = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5 border',
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 border-2',
    md: 'w-3 h-3 bottom-0 right-0 border-2',
    lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5 border-2',
    xl: 'w-4 h-4 bottom-1 right-1 border-2',
  };

  return (
    <div className={cn("relative inline-block flex-shrink-0", className)}>
      <img
        src={src || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
        alt={alt}
        className={cn(sizeClasses[size], "rounded-full object-cover border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900")}
      />
      {status && (
        <span
          className={cn("absolute rounded-full border-white dark:border-[#030014]", badgeSize[size], statusColors[status])}
        />
      )}
    </div>
  );
};

export const AvatarGroup = ({
  users = [],
  max = 4,
  size = 'md',
  className = '',
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  const overlapClasses = {
    xs: '-ml-1.5 first:ml-0 w-6 h-6 text-[10px]',
    sm: '-ml-2 first:ml-0 w-8 h-8 text-xs',
    md: '-ml-3 first:ml-0 w-10 h-10 text-sm',
    lg: '-ml-4 first:ml-0 w-12 h-12 text-base',
    xl: '-ml-5 first:ml-0 w-16 h-16 text-lg',
  };

  return (
    <div className={cn("flex items-center select-none", className)}>
      {visibleUsers.map((user, idx) => (
        <Avatar
          key={user.id || idx}
          src={user.avatar}
          alt={user.name}
          size={size}
          className={cn(overlapClasses[size], "ring-2 ring-white dark:ring-[#030014] hover:z-10 hover:scale-105 transition-all duration-300")}
        />
      ))}
      
      {remainingCount > 0 && (
        <div
          className={cn(
            overlapClasses[size],
            "flex items-center justify-center rounded-full bg-brand-purple/15 dark:bg-brand-purple/20 border border-brand-purple/20 dark:border-brand-purple/30 text-brand-purple dark:text-brand-glow font-bold ring-2 ring-white dark:ring-[#030014] z-0"
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;
