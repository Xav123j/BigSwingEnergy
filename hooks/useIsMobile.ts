import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false); // Initialize to false, will be set by useEffect

  useEffect(() => {
    // Ensure window is defined (for SSR compatibility, though less critical for 'use client')
    if (typeof window === 'undefined') {
      return;
    }

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    checkScreenSize(); // Initial check on mount (client-side)
    window.addEventListener('resize', checkScreenSize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]); // Re-run effect if breakpoint changes

  return isMobile;
};

export default useIsMobile; 