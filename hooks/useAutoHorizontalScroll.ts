import { useEffect, useRef, RefObject } from 'react';

type Options = {
  speed?: number;
  sectionRef?: RefObject<HTMLElement>; // For observing section visibility instead of container
};

// Debug helper
const logWithTimestamp = (message: string, data?: any) => {
  const timestamp = new Date().toISOString().substr(11, 8); // HH:MM:SS
  console.log(`[${timestamp}] AUTO-SCROLL: ${message}`, data || '');
};

const useAutoHorizontalScroll = (
  containerRef: RefObject<HTMLDivElement>,
  options?: Options
): void => {
  const { speed = 0.5, sectionRef } = options || {};
  
  const animationFrameIdRef = useRef<number | null>(null);
  const scrollDirectionRef = useRef<'right' | 'left'>('right');
  const hasUserInteractedRef = useRef<boolean>(false);
  const hasStartedRef = useRef<boolean>(false);
  
  // Cleanup function to cancel animation
  const stopScroll = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
      logWithTimestamp('Animation stopped');
    }
  };
  
  // The animation function
  const scroll = () => {
    const container = containerRef.current;
    if (!container) {
      logWithTimestamp('Container ref is null, stopping scroll');
      stopScroll();
      return;
    }
    
    if (hasUserInteractedRef.current) {
      logWithTimestamp('User has interacted, stopping auto-scroll');
      stopScroll();
      return;
    }
    
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    // If this is the first frame, log the scroll dimensions
    if (!hasStartedRef.current) {
      logWithTimestamp('Starting auto-scroll with dimensions', {
        scrollWidth: container.scrollWidth,
        clientWidth: container.clientWidth,
        maxScroll,
        direction: scrollDirectionRef.current
      });
      hasStartedRef.current = true;
    }
    
    // If content isn't wide enough to scroll, don't try
    if (maxScroll <= 1) {
      logWithTimestamp('Content not scrollable (maxScroll <= 1), stopping');
      stopScroll();
      return;
    }
    
    if (scrollDirectionRef.current === 'right') {
      container.scrollLeft += speed;
      if (container.scrollLeft >= maxScroll - speed) {
        scrollDirectionRef.current = 'left';
        logWithTimestamp('Reached right edge, changing direction to left', {
          scrollLeft: container.scrollLeft,
          maxScroll
        });
      }
    } else {
      container.scrollLeft -= speed;
      if (container.scrollLeft <= speed) {
        scrollDirectionRef.current = 'right';
        logWithTimestamp('Reached left edge, changing direction to right', {
          scrollLeft: container.scrollLeft
        });
      }
    }
    
    animationFrameIdRef.current = requestAnimationFrame(scroll);
  };
  
  // Force a reset of the scroll position and animation
  const resetAndStart = () => {
    logWithTimestamp('Resetting scroll position and starting animation');
    stopScroll();
    hasStartedRef.current = false;
    
    if (containerRef.current && !hasUserInteractedRef.current) {
      // Reset scroll direction to right and position to left edge
      scrollDirectionRef.current = 'right';
      containerRef.current.scrollLeft = 0;
      
      // Delay starting animation slightly to allow DOM updates
      setTimeout(() => {
        logWithTimestamp('Starting animation after reset');
        animationFrameIdRef.current = requestAnimationFrame(scroll);
      }, 50);
    }
  };
  
  // Start the animation when component mounts or after user interaction stops
  useEffect(() => {
    logWithTimestamp('Component mounted, waiting for layout to stabilize');
    // Wait for initial layout to stabilize
    const timer = setTimeout(() => {
      logWithTimestamp('Initial timeout complete, attempting to start animation');
      resetAndStart();
    }, 1500); // Increased time to ensure images are loaded
    
    return () => {
      clearTimeout(timer);
      stopScroll();
    };
  }, []);
  
  // Handle user interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      logWithTimestamp('Container not available for interaction listeners');
      return;
    }
    
    logWithTimestamp('Setting up interaction listeners');
    
    const handleInteraction = (e: Event) => {
      if (!hasUserInteractedRef.current) {
        hasUserInteractedRef.current = true;
        logWithTimestamp('User interaction detected, stopping auto-scroll', {
          type: e.type,
          target: (e.target as HTMLElement).tagName
        });
        stopScroll();
      }
    };
    
    // Handle arrow button clicks separately
    const handleArrowClick = (e: Event) => {
      logWithTimestamp('Arrow button clicked, stopping auto-scroll');
      hasUserInteractedRef.current = true;
      stopScroll();
    };
    
    // Attach button event listeners to arrow buttons
    const arrowButtons = document.querySelectorAll('[aria-label="Previous gallery slide"], [aria-label="Next gallery slide"]');
    arrowButtons.forEach(button => {
      button.addEventListener('click', handleArrowClick);
    });
    
    container.addEventListener('wheel', handleInteraction);
    container.addEventListener('touchstart', handleInteraction);
    container.addEventListener('mousedown', handleInteraction);
    
    return () => {
      container.removeEventListener('wheel', handleInteraction);
      container.removeEventListener('touchstart', handleInteraction);
      container.removeEventListener('mousedown', handleInteraction);
      
      arrowButtons.forEach(button => {
        button.removeEventListener('click', handleArrowClick);
      });
      
      logWithTimestamp('Removed interaction listeners');
    };
  }, [containerRef]);
  
  // Observe the section if provided, otherwise observe the container
  useEffect(() => {
    const elementToObserve = sectionRef?.current || containerRef.current;
    if (!elementToObserve) {
      logWithTimestamp('No element available for IntersectionObserver');
      return;
    }
    
    logWithTimestamp('Setting up IntersectionObserver on', {
      element: sectionRef?.current ? 'sectionRef' : 'containerRef',
      id: elementToObserve.id || 'no-id'
    });
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        logWithTimestamp('Intersection changed', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          boundingClientRect: {
            top: Math.round(entry.boundingClientRect.top),
            bottom: Math.round(entry.boundingClientRect.bottom),
            height: Math.round(entry.boundingClientRect.height)
          }
        });
        
        if (entry.isIntersecting && !hasUserInteractedRef.current) {
          logWithTimestamp('Element is in view, starting scroll if not already running');
          if (!animationFrameIdRef.current) {
            resetAndStart();
          }
        } else {
          logWithTimestamp('Element out of view or user interacted, stopping scroll');
          stopScroll();
        }
      },
      { threshold: 0.1 } // More lenient threshold - only 10% needs to be visible
    );
    
    observer.observe(elementToObserve);
    
    return () => {
      observer.disconnect();
      stopScroll();
      logWithTimestamp('IntersectionObserver disconnected');
    };
  }, [sectionRef, containerRef]);
  
  // Check container size changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        logWithTimestamp('Container size changed', { width, height });
        
        // If animation is running, check if we need to reset
        if (animationFrameIdRef.current && !hasUserInteractedRef.current) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          if (maxScroll <= 1) {
            logWithTimestamp('Container no longer scrollable after resize, stopping');
            stopScroll();
          } else if (!hasStartedRef.current) {
            resetAndStart();
          }
        }
      }
    });
    
    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);
  
  // Final cleanup
  useEffect(() => {
    return () => {
      stopScroll();
      logWithTimestamp('Component unmounted, final cleanup complete');
    };
  }, []);
};

export default useAutoHorizontalScroll; 