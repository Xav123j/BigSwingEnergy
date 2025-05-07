'use client';

import { useState, useEffect } from 'react';

export function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = navigator.connection as EventTarget & { saveData: boolean };
      setSaveData(connection.saveData);

      const changeHandler = () => {
        setSaveData(connection.saveData);
      };

      connection.addEventListener('change', changeHandler);
      return () => {
        connection.removeEventListener('change', changeHandler);
      };
    } else {
      // Assume false if API not available (e.g., server-side or older browser)
      setSaveData(false);
    }
  }, []);

  return saveData;
} 