import { useEffect, useRef, RefObject } from 'react';

type Options = {
  speed?: number;
  sectionRef?: RefObject<HTMLElement>; // For observing section visibility instead of container
  disabled?: boolean; // To completely disable auto-scrolling, useful for mobile
  pauseDuration?: number; // Duration to pause auto-scroll after manual interaction in milliseconds
};

// Debug helper with more comprehensive logging
const logWithTimestamp = (message: string, data?: any) => {
  // Always log in development for debugging
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = new Date().toISOString().substr(11, 8); // HH:MM:SS
    console.log(`[${timestamp}] AUTO-SCROLL: ${message}`, data || '');
  }
};

const useAutoHorizontalScroll = (
  containerRef: RefObject<HTMLDivElement>,
  options?: Options
): void => {
  const { 
    speed = 0.5, 
    sectionRef, 
    disabled = false,
    pauseDuration = 2000 // Default pause of 2 seconds after manual interaction
  } = options || {};
  
  const animationFrameIdRef = useRef<number | null>(null);
  const scrollDirectionRef = useRef<'right' | 'left'>('right');
  const hasUserInteractedRef = useRef<boolean>(false);
  const hasStartedRef = useRef<boolean>(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollPositionRef = useRef<number>(0);
  const lastManualScrollTimeRef = useRef<number>(0);
  const currentSpeedRef = useRef<number>(0);
  const targetSpeedRef = useRef<number>(speed);
  
  // Cleanup function to cancel animation
  const stopScroll = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
      logWithTimestamp('Animation stopped');
    }
  };
  
  // The animation function with smooth acceleration/deceleration
  const scroll = () => {
    const container = containerRef.current;
    if (!container || disabled) {
      logWithTimestamp('Container ref is null or scrolling is disabled, stopping scroll');
      stopScroll();
      return;
    }
    
    if (hasUserInteractedRef.current) {
      logWithTimestamp('User has interacted, stopping auto-scroll temporarily');
      stopScroll();
      return;
    }
    
    const now = Date.now();
    // If user manually scrolled very recently (last 100ms), wait before auto-scrolling
    if (now - lastManualScrollTimeRef.current < 100) {
      animationFrameIdRef.current = requestAnimationFrame(scroll);
      return;
    }
    
    // Capture current scroll position to detect manual scrolling
    const currentScrollPos = container.scrollLeft;
    // If significant scroll position change occurred without auto-scroll action, user is manually scrolling
    if (Math.abs(currentScrollPos - lastScrollPositionRef.current) > 2 && !hasUserInteractedRef.current) {
      lastManualScrollTimeRef.current = now;
      lastScrollPositionRef.current = currentScrollPos;
      animationFrameIdRef.current = requestAnimationFrame(scroll);
      return;
    }
    
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    // If this is the first frame, log the scroll dimensions
    if (!hasStartedRef.current) {
      logWithTimestamp('Starting auto-scroll with dimensions', {
        scrollWidth: container.scrollWidth,
        clientWidth: container.clientWidth,
        currentScrollLeft: container.scrollLeft,
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
    
    // Smooth acceleration: gradually increase speed to target over time
    if (currentSpeedRef.current < targetSpeedRef.current) {
      currentSpeedRef.current = Math.min(targetSpeedRef.current, currentSpeedRef.current + 0.05);
    }
    
    if (scrollDirectionRef.current === 'right') {
      container.scrollLeft += currentSpeedRef.current;
      if (container.scrollLeft >= maxScroll - currentSpeedRef.current) {
        container.scrollLeft = maxScroll;
        scrollDirectionRef.current = 'left';
        logWithTimestamp('Reached right edge, changing direction to left', {
          scrollLeft: container.scrollLeft,
          maxScroll
        });
      }
    } else {
      container.scrollLeft -= currentSpeedRef.current;
      if (container.scrollLeft <= currentSpeedRef.current) {
        container.scrollLeft = 0;
        scrollDirectionRef.current = 'right';
        logWithTimestamp('Reached left edge, changing direction to right', {
          scrollLeft: container.scrollLeft
        });
      }
    }
    
    // Update last scroll position for manual scroll detection
    lastScrollPositionRef.current = container.scrollLeft;
    
    animationFrameIdRef.current = requestAnimationFrame(scroll);
  };
  
  // Force a reset of the scroll position and animation
  const resetAndStart = () => {
    logWithTimestamp('Resetting animation state. User interacted:', hasUserInteractedRef.current);
    stopScroll();
    hasStartedRef.current = false;
    
    const container = containerRef.current;
    if (container && !disabled && !hasUserInteractedRef.current) {
      // When resuming auto-scroll, we want to continue from current position, not reset to start
      const currentPosition = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      // Determine scroll direction based on current position
      if (currentPosition > maxScroll / 2) {
        scrollDirectionRef.current = 'left';
        logWithTimestamp('Resuming with direction = left based on current position', {
          currentPosition,
          maxScroll
        });
      } else {
        scrollDirectionRef.current = 'right';
        logWithTimestamp('Resuming with direction = right based on current position', {
          currentPosition,
          maxScroll
        });
      }
      
      // Start with very slow speed and gradually accelerate
      currentSpeedRef.current = 0.1;
      lastScrollPositionRef.current = currentPosition;
      
      setTimeout(() => {
        if (!hasUserInteractedRef.current && !disabled) {
            logWithTimestamp('Starting animation after reset timeout');
            animationFrameIdRef.current = requestAnimationFrame(scroll);
        } else {
            logWithTimestamp('Animation start aborted after reset (interacted or disabled)');
        }
      }, 50);
    } else {
      logWithTimestamp('ResetAndStart: Conditions not met to start scroll', {disabled, hasUserInteracted: hasUserInteractedRef.current, containerExists: !!container});
    }
  };
  
  // Start the animation when component mounts or after user interaction stops
  useEffect(() => {
    if (disabled) {
      logWithTimestamp(`Auto-scrolling is explicitly disabled via prop. Stopping scroll.`);
      stopScroll();
      return;
    }
    
    logWithTimestamp('useEffect [disabled]: (Re)starting. User interacted:', hasUserInteractedRef.current);
    const timer = setTimeout(() => {
        logWithTimestamp('Initial mount/enable timeout complete, attempting to resetAndStart');
        resetAndStart();
    }, 1000);
    
    return () => {
        clearTimeout(timer);
    };
  }, [disabled]);
  
  // Reset user interaction state specifically when the component becomes re-enabled
  useEffect(() => {
    if (!disabled) {
      logWithTimestamp('Hook re-enabled (disabled is false). Resetting interaction state.');
      hasUserInteractedRef.current = false;
      hasStartedRef.current = false;
    }
  }, [disabled]);
  
  // Handle user interaction
  useEffect(() => {
    if (disabled) {
      logWithTimestamp('Interaction listeners skipped (disabled)');
      return;
    }
    
    const container = containerRef.current;
    if (!container) {
      logWithTimestamp('Container not available for interaction listeners');
      return;
    }
    
    logWithTimestamp('Setting up interaction listeners');
    
    // Track last scroll position to detect manual scrolling
    let scrolling = false;
    let scrollTimeout: NodeJS.Timeout | null = null;
    
    const handleInteraction = (e: Event) => {
      // Clear any existing timeout to restart the pause period
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = null;
      }
      
      hasUserInteractedRef.current = true;
      logWithTimestamp('User interaction detected, temporarily pausing auto-scroll', { type: e.type });
      stopScroll();
      
      // Record the time of this manual interaction
      lastManualScrollTimeRef.current = Date.now();
      
      // Set a timeout to resume auto-scrolling after pauseDuration
      interactionTimeoutRef.current = setTimeout(() => {
        logWithTimestamp('Interaction timeout complete, resuming auto-scroll');
        hasUserInteractedRef.current = false;
        resetAndStart();
        interactionTimeoutRef.current = null;
      }, pauseDuration);
    };
    
    // Improved scroll handling for smoother transitions
    const handleScroll = () => {
      // Update last manual scroll time
      lastManualScrollTimeRef.current = Date.now();
      
      // Don't treat auto-scrolling as manual interaction
      if (animationFrameIdRef.current) return;
      
      if (!scrolling) {
        scrolling = true;
        logWithTimestamp('Scroll started - pausing auto-scroll');
        hasUserInteractedRef.current = true;
        stopScroll();
      }
      
      // Clear any previous scroll end timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set a new timeout for scroll end detection
      scrollTimeout = setTimeout(() => {
        scrolling = false;
        logWithTimestamp('Scroll ended - will resume auto-scroll after pause duration');
        
        // Clear any existing timeout
        if (interactionTimeoutRef.current) {
          clearTimeout(interactionTimeoutRef.current);
        }
        
        // Set timeout to resume auto-scrolling
        interactionTimeoutRef.current = setTimeout(() => {
          logWithTimestamp('Scroll timeout complete, resuming auto-scroll');
          hasUserInteractedRef.current = false;
          resetAndStart();
          interactionTimeoutRef.current = null;
        }, pauseDuration);
      }, 150); // Short timeout to detect scroll ending
    };
    
    // Handle arrow button clicks separately
    const handleArrowClick = (e: Event) => {
      // Clear any existing timeout to restart the pause period
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = null;
      }
      
      hasUserInteractedRef.current = true;
      logWithTimestamp('Arrow button clicked, temporarily pausing auto-scroll');
      stopScroll();
      
      // Record the time of this manual interaction
      lastManualScrollTimeRef.current = Date.now();
      
      // Set a timeout to resume auto-scrolling after pauseDuration
      interactionTimeoutRef.current = setTimeout(() => {
        logWithTimestamp('Arrow click timeout complete, resuming auto-scroll');
        hasUserInteractedRef.current = false;
        resetAndStart();
        interactionTimeoutRef.current = null;
      }, pauseDuration);
    };
    
    // Attach button event listeners to arrow buttons
    const arrowButtons = document.querySelectorAll('[aria-label="Previous gallery slide"], [aria-label="Next gallery slide"]');
    arrowButtons.forEach(button => {
      button.addEventListener('click', handleArrowClick);
    });
    
    container.addEventListener('wheel', handleInteraction, { passive: true });
    container.addEventListener('touchstart', handleInteraction, { passive: true });
    container.addEventListener('mousedown', handleInteraction);
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('wheel', handleInteraction);
      container.removeEventListener('touchstart', handleInteraction);
      container.removeEventListener('mousedown', handleInteraction);
      container.removeEventListener('scroll', handleScroll);
      
      arrowButtons.forEach(button => {
        button.removeEventListener('click', handleArrowClick);
      });
      
      // Clear any existing timeout when unmounting
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = null;
      }
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      logWithTimestamp('Cleaning up interaction listeners');
    };
  }, [containerRef, disabled, pauseDuration]);
  
  // Observe the section if provided, otherwise observe the container
  useEffect(() => {
    if (disabled) {
      logWithTimestamp('IntersectionObserver skipped (disabled)');
      return;
    }
    
    const elementToObserve = sectionRef?.current || containerRef.current;
    if (!elementToObserve) {
      logWithTimestamp('No element for IntersectionObserver');
      return;
    }
    
    logWithTimestamp('Setting up IntersectionObserver on', { element: elementToObserve.id || 'container' });
    const observer = new IntersectionObserver(
      ([entry]) => {
        logWithTimestamp('Intersection changed', { isIntersecting: entry.isIntersecting, ratio: entry.intersectionRatio });
        if (entry.isIntersecting && !hasUserInteractedRef.current && !disabled) {
          logWithTimestamp('Element in view, (re)starting scroll');
          if (!animationFrameIdRef.current) {
            resetAndStart();
          }
        } else {
          logWithTimestamp('Element out of view or user interacted/disabled, stopping scroll');
          stopScroll();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(elementToObserve);
    
    return () => {
      logWithTimestamp('IntersectionObserver disconnected');
      observer.disconnect();
    };
  }, [sectionRef, containerRef, disabled]);
  
  // Check container size changes
  useEffect(() => {
    if (disabled) {
        logWithTimestamp('ResizeObserver skipped (disabled)');
        return;
    }
    
    const container = containerRef.current;
    if (!container) return;
    
    logWithTimestamp('Setting up ResizeObserver');
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        logWithTimestamp('Container size changed', { width });
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll <= 1 && animationFrameIdRef.current) {
          logWithTimestamp('Container no longer scrollable after resize, stopping');
          stopScroll();
        } else if (maxScroll > 1 && !animationFrameIdRef.current && !hasUserInteractedRef.current && !disabled) {
          logWithTimestamp('Container became scrollable or scroll stopped, trying to restart.');
          resetAndStart();
        }
      }
    });
    
    resizeObserver.observe(container);
    
    return () => {
      logWithTimestamp('ResizeObserver disconnected');
      resizeObserver.disconnect();
    };
  }, [containerRef, disabled, pauseDuration]);
  
  // Final cleanup
  useEffect(() => {
    return () => {
      logWithTimestamp('Final cleanup (component unmount). Stopping scroll.');
      stopScroll();
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = null;
      }
    };
  }, []);
};

export default useAutoHorizontalScroll; 