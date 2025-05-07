'use client';

import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';

interface ToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, message, onClose }) => {
  // Auto-hide the toast after set duration
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 bg-brand-gold text-brand-black 
                    px-4 py-3 rounded-lg shadow-lg flex items-center justify-between"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          role="alert"
          aria-live="assertive"
        >
          <p className="font-medium pr-2">{message}</p>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/10 transition-colors duration-200"
            aria-label="Close notification"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 