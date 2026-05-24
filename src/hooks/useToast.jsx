import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            let borderStyle = 'border-brand-purple/30';
            let textClass = 'text-white';
            let Icon = Info;
            let iconColor = 'text-brand-purple';

            if (toast.type === 'success') {
              borderStyle = 'border-emerald-500/30';
              textClass = 'text-emerald-100';
              Icon = CheckCircle2;
              iconColor = 'text-emerald-400';
            } else if (toast.type === 'error') {
              borderStyle = 'border-red-500/30';
              textClass = 'text-red-100';
              Icon = XCircle;
              iconColor = 'text-red-400';
            } else if (toast.type === 'warning') {
              borderStyle = 'border-amber-500/30';
              textClass = 'text-amber-100';
              Icon = AlertCircle;
              iconColor = 'text-amber-400';
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`glass-panel flex items-center gap-3 px-4 py-3.5 rounded-xl border ${borderStyle} ${textClass} text-sm shadow-2xl pointer-events-auto min-w-[280px] max-w-sm`}
              >
                <div className="flex-shrink-0">
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-grow font-medium leading-tight">{toast.message}</div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
