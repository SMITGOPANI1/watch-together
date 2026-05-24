import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  ...props
}) => {
  let baseStyle = "relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none overflow-hidden select-none active:scale-[0.98]";
  let variantStyle = "";

  if (variant === 'primary') {
    variantStyle = "bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:brightness-110 shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:shadow-[0_0_22px_rgba(139,92,246,0.5)]";
  } else if (variant === 'secondary') {
    variantStyle = "bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-900/10 dark:hover:bg-white/10 hover:border-brand-purple/40";
  } else if (variant === 'outline') {
    variantStyle = "bg-transparent border border-slate-900/20 dark:border-white/20 text-slate-700 dark:text-white hover:border-slate-900/40 dark:hover:border-white/40 hover:bg-slate-900/5 dark:hover:bg-white/5";
  } else if (variant === 'danger') {
    variantStyle = "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-100 hover:bg-red-500/20 hover:border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
  } else if (variant === 'glow') {
    variantStyle = "bg-slate-900 dark:bg-white text-white dark:text-[#030014] hover:bg-slate-800 dark:hover:bg-white/90 shadow-[0_0_20px_rgba(139,92,246,0.25)]";
  }

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      type={type}
      className={cn(baseStyle, variantStyle, isDisabled && 'opacity-50 cursor-not-allowed', className)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
    </motion.button>
  );
};
export default Button;
