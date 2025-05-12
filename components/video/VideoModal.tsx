'use client';

import React, { Fragment, useRef, useEffect, useState, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useVideoContext } from '@/context/VideoContext';
import CTAButton from '@/components/CTAButton';
import { useAudioManager } from '@/context/AudioManager';
import { videos, VideoData } from '@/data/videos';

// TypeScript declaration for the YouTube Iframe API
declare global {
  interface Window {
    YT: any; // You can replace 'any' with more specific types if you have them
    onYouTubeIframeAPIReady?: () => void;
  }
}

const VideoModal: React.FC = () => {
  const { isModalOpen, setIsModalOpen, getCurrentVideo, setCurrentVideoId } = useVideoContext();
  const playerRef = useRef<any>(null); // For the YouTube player instance
  const currentVideo = getCurrentVideo();
  const [showCTA, setShowCTA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { fadeOutAllExcept, restoreVolume } = useAudioManager();

  const navigateVideo = useCallback((direction: 'next' | 'prev') => {
    if (!currentVideo) return;
    
    const currentIndex = videos.findIndex(video => video.id === currentVideo.id);
    if (currentIndex === -1) return; // Should not happen if currentVideo is valid

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % videos.length;
    } else {
      newIndex = (currentIndex - 1 + videos.length) % videos.length;
    }
    
    const newVideoId = videos[newIndex]?.id;
    if (newVideoId) {
      setCurrentVideoId(newVideoId);
    }
  }, [currentVideo, setCurrentVideoId, videos]); // `videos` is stable from import

  const onPlayerStateChange = useCallback((event: any) => {
    // YT.PlayerState.ENDED is 0
    if (event.data === 0) { 
      navigateVideo('next');
    }
  }, [navigateVideo]);

  const handleIframeLoad = useCallback(() => {
    if (!isModalOpen || !currentVideo) {
      return;
    }

    if (typeof window.YT === 'undefined' || typeof window.YT.Player === 'undefined') {
      console.warn('YouTube API (window.YT) not available. Autoplay next video on end will not work until API loads.');
      // Optionally, you could try to load the API script here if it's not present,
      // but that adds complexity (e.g., ensuring it's loaded only once).
      // For now, we assume it's loaded or will be soon.
      return;
    }

    // Destroy existing player instance if any
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.error("Error destroying previous player:", e);
      }
      playerRef.current = null;
    }
    
    // Create new player instance
    try {
      // The iframe must have the ID 'youtube-player-modal'
      playerRef.current = new window.YT.Player('youtube-player-modal', {
        events: {
          'onStateChange': onPlayerStateChange,
        },
      });
    } catch (error) {
      console.error("Error creating YouTube player:", error);
    }
  }, [isModalOpen, currentVideo, onPlayerStateChange]);
  
  // Effect to load the YouTube API script if not already present
  // This runs once when the component mounts.
  useEffect(() => {
    const scriptId = 'youtube-iframe-api-script';
    if (document.getElementById(scriptId)) {
      return; // Script already added
    }

    if (typeof window.YT === 'undefined' || typeof window.YT.Player === 'undefined') {
      const tag = document.createElement('script');
      tag.id = scriptId;
      tag.src = "https://www.youtube.com/iframe_api";
      // The YouTube API script will automatically call `window.onYouTubeIframeAPIReady`
      // when it's loaded and ready. `handleIframeLoad` checks for `window.YT` existence.
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        // Fallback if no script tags are found (e.g., in a very minimal document)
        document.head.appendChild(tag);
      }
    }
  }, []);

  // Check if device is mobile with more strict criteria
  useEffect(() => {
    const checkMobile = () => {
      // Check for mobile devices using multiple criteria
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileDevice && isSmallScreen && hasTouchScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle orientation change and fullscreen on mobile
  useEffect(() => {
    // Only proceed if we're on a mobile device and the modal is open
    if (!isMobile || !isModalOpen) return;

    // Try multiple methods to lock orientation
    const lockOrientation = async () => {
      try {
        // Method 1: Screen Orientation API
        if (screen.orientation) {
          await (screen.orientation as any).lock?.('landscape');
        }
        
        // Method 2: Legacy orientation lock
        if ((screen as any).lockOrientation) {
          (screen as any).lockOrientation('landscape');
        } else if ((screen as any).mozLockOrientation) {
          (screen as any).mozLockOrientation('landscape');
        } else if ((screen as any).msLockOrientation) {
          (screen as any).msLockOrientation('landscape');
        }
      } catch (error) {
        console.log('Orientation lock not supported:', error);
      }
    };

    // Try multiple methods to enter fullscreen
    const enterFullscreen = async () => {
      const videoContainer = document.querySelector('.video-container');
      if (!videoContainer) return;

      try {
        // Method 1: Standard fullscreen API
        if (videoContainer.requestFullscreen) {
          await videoContainer.requestFullscreen();
        }
        // Method 2: Webkit fullscreen
        else if ((videoContainer as any).webkitRequestFullscreen) {
          await (videoContainer as any).webkitRequestFullscreen();
        }
        // Method 3: Mozilla fullscreen
        else if ((videoContainer as any).mozRequestFullScreen) {
          await (videoContainer as any).mozRequestFullScreen();
        }
        // Method 4: MS fullscreen
        else if ((videoContainer as any).msRequestFullscreen) {
          await (videoContainer as any).msRequestFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen not supported:', error);
      }
    };

    // Execute both functions
    lockOrientation();
    enterFullscreen();

    // Cleanup function
    return () => {
      // Only cleanup if we're on mobile
      if (!isMobile) return;

      // Unlock orientation
      try {
        if (screen.orientation) {
          (screen.orientation as any).unlock?.();
        }
        if ((screen as any).unlockOrientation) {
          (screen as any).unlockOrientation();
        } else if ((screen as any).mozUnlockOrientation) {
          (screen as any).mozUnlockOrientation();
        } else if ((screen as any).msUnlockOrientation) {
          (screen as any).msUnlockOrientation();
        }
      } catch (error) {
        console.log('Orientation unlock failed:', error);
      }

      // Exit fullscreen
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      } catch (error) {
        console.log('Exit fullscreen failed:', error);
      }
    };
  }, [isModalOpen, isMobile]);

  // Add event listener for orientation change
  useEffect(() => {
    // Only add listener if we're on mobile
    if (!isMobile) return;

    const handleOrientationChange = () => {
      if (isModalOpen) {
        // Force landscape if in portrait
        if (window.orientation === 0 || window.orientation === 180) {
          // Try to rotate to landscape
          if (screen.orientation) {
            (screen.orientation as any).lock?.('landscape').catch(() => {});
          }
        }
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [isModalOpen, isMobile]);

  // Handle closing and pausing video
  useEffect(() => {
    if (!isModalOpen) {
      // Destroy YouTube player when modal closes
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch(e) {
            console.error("Error destroying player on modal close:", e);
        }
        playerRef.current = null;
      }
      // Restore hero video audio - assumes the video ID is 'hero-video' as registered in Hero.tsx
      restoreVolume('hero-video');
    }
  }, [isModalOpen, restoreVolume]);

  // General cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch(e) {
          console.error("Error destroying player on unmount:", e);
        }
        playerRef.current = null;
      }
    };
  }, []);

  // Handle fading out hero video when modal opens
  useEffect(() => {
    if (isModalOpen && currentVideo) {
      // Fade out all other media elements when modal opens
      fadeOutAllExcept(`modal-video-${currentVideo.id}`);
    }
  }, [isModalOpen, currentVideo, fadeOutAllExcept]);

  useEffect(() => {
    if (isModalOpen) {
      setShowCTA(false);
      const timer = setTimeout(() => setShowCTA(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // Early return if no video selected
  if (!currentVideo) return null;

  // Get the YouTube embed URL with autoplay appended
  const getYouTubeEmbedUrl = () => {
    // If no URL is provided, use a fallback
    if (!currentVideo.youtubeEmbedSrc) {
      return 'about:blank';
    }
    
    // Extract video ID from URL
    const videoId = currentVideo.youtubeEmbedSrc.split('/').pop()?.split('?')[0];
    
    // Use a direct YouTube embedding URL with additional parameters for mobile
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&enablejsapi=1&rel=0&modestbranding=1&fs=1`;
  };

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={() => setIsModalOpen(false)}
      >
        {/* Backdrop with blur effect */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brand-midnight-blue/95 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        {/* Modal content - full screen with padding */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full max-w-full md:max-w-[100vw] lg:max-w-[100vw] max-h-full md:max-h-[100vh] transform overflow-hidden bg-transparent p-0 text-left align-middle transition-all flex flex-col">
                {/* Video container with border - larger size */}
                <div className="relative flex-grow w-full h-full flex flex-col">
                  {/* Exit button absolutely positioned top right */}
                  <button
                    type="button"
                    className="absolute top-0 right-9 rounded-full bg-black hover:bg-brand-gold p-2 text-white hover:text-white border-[2px] border-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold z-20"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close video"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Navigation arrows */}
                  <div className="absolute inset-0 flex items-center justify-between px-9 pointer-events-none">
                    <button
                      type="button"
                      className="rounded-full bg-black/80 hover:bg-brand-gold p-2 text-white hover:text-white border-[2px] border-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold z-20 pointer-events-auto"
                      onClick={() => navigateVideo('prev')}
                      aria-label="Previous video"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="rounded-full bg-black/80 hover:bg-brand-gold p-2 text-white hover:text-white border-[2px] border-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold z-20 pointer-events-auto"
                      onClick={() => navigateVideo('next')}
                      aria-label="Next video"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Video player - takes maximum available space */}
                  <div className={`video-container w-full ${isMobile ? 'h-screen' : 'max-w-[85vw] aspect-video'} mx-auto ${isMobile ? '' : 'rounded-lg border-[3px] border-brand-gold'} shadow-2xl bg-black overflow-hidden relative`}>
                    <iframe
                      id="youtube-player-modal"
                      key={currentVideo.id}
                      src={getYouTubeEmbedUrl()}
                      title={currentVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      className="w-full h-full z-10"
                      allowFullScreen
                      frameBorder="0"
                      style={{ margin: 0, padding: 0 }}
                      onLoad={() => {
                        fadeOutAllExcept(`modal-video-${currentVideo.id}`);
                        handleIframeLoad();
                      }}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VideoModal; 