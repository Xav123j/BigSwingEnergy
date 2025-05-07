'use client';

import { useState, useCallback } from 'react';

interface UseToastReturn {
  toast: {
    show: boolean;
    message: string;
  };
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  const showToast = useCallback((message: string, duration = 6000) => {
    setToast({ show: true, message });
    
    if (duration !== Infinity) {
      setTimeout(() => {
        hideToast();
      }, duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return { toast, showToast, hideToast };
}; 