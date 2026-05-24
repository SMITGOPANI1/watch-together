import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { hoverScale } from '../../animations/framer';

export const Card = ({
  children,
  variant = 'default', // default, glow, interactive
  className = '',
  onClick,
  ...props
}) => {
  const isInteractive = variant === 'interactive' || !!onClick;

  const cardStyles = cn(
    "rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden",
    // Light Mode styles
    "bg-white border-slate-100 shadow-sm",
    // Dark Mode styles
    "dark:bg-white/[0.02] dark:border-white/10 dark:shadow-2xl",
    
    variant === 'glow' && "border-brand-purple/20 dark:border-brand-purple/20 shadow-[0_0_20px_rgba(139,92,246,0.03)] dark:shadow-[0_0_30px_rgba(139,92,246,0.05)] bg-gradient-to-br from-white to-slate-50 dark:from-[#120B38]/30 dark:to-black/30",
    
    isInteractive && "cursor-pointer hover:bg-slate-50/80 dark:hover:bg-brand-purple/[0.04] hover:border-slate-200 dark:hover:border-brand-purple/30 hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(139,92,246,0.12)]",
    
    className
  );

  if (isInteractive) {
    return (
      <motion.div
        variants={hoverScale}
        whileHover="hover"
        whileTap="tap"
        onClick={onClick}
        className={cardStyles}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardStyles} {...props}>
      {children}
    </div>
  );
};

export default Card;
