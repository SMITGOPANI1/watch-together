import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({
  variant = 'text', // text, circular, rectangular
  width,
  height,
  className = '',
}) => {
  const styles = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  const variantClasses = {
    text: 'rounded-md py-1 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      style={styles}
      className={cn(
        "animate-pulse bg-slate-900/[0.04] dark:bg-white/[0.04] border border-slate-900/[0.02] dark:border-white/[0.03]",
        variantClasses[variant],
        className
      )}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-[#120B38]/30 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-4 shadow-sm dark:shadow-2xl">
      <Skeleton variant="rectangular" height="150px" />
      <Skeleton variant="text" width="70%" className="h-6" />
      <Skeleton variant="text" width="40%" className="h-4" />
      <div className="flex justify-between items-center mt-2">
        <Skeleton variant="circular" width="32px" height="32px" />
        <Skeleton variant="text" width="30%" className="h-8" />
      </div>
    </div>
  );
};

export default Skeleton;
