import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Dropdown = ({
  trigger,
  items = [], // [{ id, label, icon, onClick, className }]
  className = '',
  menuClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer select-none">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 mt-2 w-48 rounded-xl border shadow-xl z-50 overflow-hidden backdrop-blur-md",
              "bg-white border-slate-200 text-slate-800",
              "dark:bg-[#090522]/95 dark:border-white/10 dark:text-white",
              menuClassName
            )}
          >
            <div className="py-1">
              {items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id || idx}
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left focus:outline-none",
                      item.className
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-gray-500" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
