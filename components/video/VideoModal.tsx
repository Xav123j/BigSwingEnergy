'use client';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import type { Dialog as HeadlessUIDialog } from '@headlessui/react';
import type { motion as FramerMotionMotion, AnimatePresence as FramerMotionAnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAudioManager } from '@/context/AudioManager';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useSaveData } from '@/hooks/useSaveData';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  videoTitle: string;
  videoPoster?: string;
  youtubeEmbedSrc?: string; // Optional YouTube embed URL
}

// Dynamically imported components module store
let HUIDialog: typeof HeadlessUIDialog | null = null;
let FMMotion: typeof FramerMotionMotion | null = null;
let FMAnimatePresence: typeof FramerMotionAnimatePresence | null = null;

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc, videoTitle, videoPoster, youtubeEmbedSrc }) => {
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialFocusRef = useRef(null);
  const audioManager = useAudioManager();
  const prefersReducedMotion = usePrefersReducedMotion();
  const saveData = useSaveData();

  // Force enable animations for testing
  const motionEnabled = true;

  const videoId = `modal-video-${videoTitle.replace(/\s+/g, '-').toLowerCase()}`;

  // Sync external state with local state
  useEffect(() => {
    if (isOpen) {
      setLocalIsOpen(true);
      setIsExiting(false);
      // Add overlay class to body to prevent scrolling
      document.body.classList.add('modal-open');
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("Loading animation libraries...");
    
    Promise.all([
      import('@headlessui/react').then(mod => { 
        console.log("Headless UI loaded");
        HUIDialog = mod.Dialog; 
      }),
      import('framer-motion').then(mod => { 
        console.log("Framer Motion loaded");
        FMMotion = mod.motion; 
        FMAnimatePresence = mod.AnimatePresence; 
      }),
    ]).then(() => {
      console.log("All animation libraries loaded successfully");
      setLibrariesLoaded(true);
    })
    .catch(err => console.error("Failed to load modal libraries", err));
  }, []);

  useEffect(() => {
    let currentVideoElement = videoRef.current;

    if (localIsOpen && currentVideoElement && !youtubeEmbedSrc) {
      const playVideo = () => {
        if (currentVideoElement && !prefersReducedMotion && !saveData) {
          currentVideoElement.play().catch(e => console.warn("Video autoplay warning:", e));
        }
      };

      if (currentVideoElement.readyState >= 3) {
        audioManager.registerMediaElement(videoId, currentVideoElement);
        playVideo();
      }
      audioManager.fadeOutAllExcept(videoId); 
    } else if (localIsOpen && youtubeEmbedSrc) {
      // For YouTube videos, just fade out other audio
      audioManager.fadeOutAllExcept(videoId);
    }
    
    return () => {
      if (currentVideoElement) {
        currentVideoElement.pause();
        audioManager.unregisterMediaElement(videoId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localIsOpen, videoId, prefersReducedMotion, saveData, youtubeEmbedSrc]);

  const handleClose = () => {
    console.log("Modal close triggered - starting exit animation");
    
    // Pause the video immediately when starting to close
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // Start exit animation
    setIsExiting(true);
    
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      console.log("Animation timeout complete - closing modal");
      
      const backgroundMediaIds = ['hero-video']; 
      backgroundMediaIds.forEach(id => {
        const vol = audioManager.getOriginalVolume(id);
        if (vol !== undefined) {
          audioManager.restoreVolume(id);
        }
      });
      
      audioManager.unregisterMediaElement(videoId);
      setLocalIsOpen(false);
      onClose();
      // Remove overlay class from body to allow scrolling
      document.body.classList.remove('modal-open');
    }, 750); // Give a little extra time to ensure animation completes
  };

  if (!librariesLoaded || !HUIDialog || !FMMotion || !FMAnimatePresence) {
    return null; 
  }

  const Dialog = HUIDialog;
  const motion = FMMotion;
  const AnimatePresence = FMAnimatePresence;

  console.log("Render state:", { localIsOpen, isExiting, isOpen });

  if (!localIsOpen) return null;

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={initialFocusRef}
      className="relative z-[100]"
    >
      {/* Backdrop with smoother transitions */}
      <div 
        className={`fixed inset-0 z-[99] pointer-events-none
          ${isExiting 
            ? 'opacity-0 backdrop-blur-[0px]' 
            : 'opacity-100 backdrop-blur-sm bg-black/80'
          } transition-opacity transition-[backdrop-filter] duration-700 ease-out`} 
        aria-hidden="true"
      />
      
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          key={youtubeEmbedSrc || videoSrc}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={isExiting ? {
            opacity: 0,
            scale: 0.8,
            y: 50,
            filter: "blur(8px)",
            transition: {
              duration: 0.7,
              ease: [0.32, 0.72, 0, 1]
            }
          } : {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              damping: 25,
              stiffness: 120
            }
          }}
          className="relative w-full max-w-[90vw] max-h-[90vh] bg-brand-black rounded-lg shadow-2xl overflow-hidden border border-brand-champagne/20 pointer-events-auto video-render-fix"
        >
          <Dialog.Panel as="div" className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-brand-champagne/10">
              <Dialog.Title as="h3" className="text-xl font-medium font-serif text-brand-gold">
                {videoTitle}
              </Dialog.Title>
              <button
                ref={initialFocusRef}
                onClick={handleClose}
                className="p-2 rounded-md text-brand-champagne/70 hover:text-brand-gold hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black transition-colors duration-200"
                aria-label="Close video player"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
            <div className="w-full h-full bg-black flex-1 flex items-center justify-center overflow-hidden video-render-fix">
              {youtubeEmbedSrc ? (
                <div className="w-full h-full flex items-center justify-center video-render-fix" style={{ maxWidth: '1280px', maxHeight: '80vh' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={youtubeEmbedSrc + (youtubeEmbedSrc.includes('?') ? '&' : '?') + 'autoplay=1&mute=0'}
                    title={videoTitle}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    className={`aspect-video transition-opacity duration-300 ${isExiting ? 'opacity-30' : 'opacity-100'}`}
                    style={{ maxHeight: '80vh' }}
                    onLoad={() => {
                      // For YouTube videos, fade out other audio
                      audioManager.fadeOutAllExcept(videoId);
                    }}
                  ></iframe>
                </div>
              ) : videoSrc && (
                 <video
                    ref={videoRef}
                    src={videoSrc}
                    poster={videoPoster}
                    controls
                    playsInline
                    preload="auto"
                    aria-label={videoTitle}
                    className={`w-full h-full max-h-[80vh] object-contain transition-opacity duration-300 ${isExiting ? 'opacity-30' : 'opacity-100'} video-render-fix`}
                    onLoadedData={() => {
                        const currentVideoElement = videoRef.current;
                        if (currentVideoElement) {
                            audioManager.registerMediaElement(videoId, currentVideoElement);
                            if (!prefersReducedMotion && !saveData) {
                                currentVideoElement.play().catch(e => console.warn("Video autoplay failed:", e));
                            }
                        }
                    }}
                    onVolumeChange={() => {
                        if(videoRef.current) {
                            audioManager.registerMediaElement(videoId, videoRef.current); 
                        }
                    }}
                  >
                    Your browser does not support the video tag.
                </video>
              )}
            </div>
          </Dialog.Panel>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default VideoModal; 