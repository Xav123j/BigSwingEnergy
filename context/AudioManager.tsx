'use client';

import React, { createContext, useContext, useRef, useCallback, ReactNode } from 'react';

const FADE_DURATION = 800; // ms

interface MediaElementInfo {
  element: HTMLMediaElement;
  originalVolume: number;
  isFadingOut?: boolean;
  isFadingIn?: boolean;
}

interface AudioManagerContextType {
  registerMediaElement: (id: string, element: HTMLMediaElement) => void;
  unregisterMediaElement: (id: string) => void;
  fadeOutAllExcept: (exceptId?: string) => void;
  fadeToVolume: (id: string, targetVolume: number, duration?: number) => void;
  restoreVolume: (id: string, duration?: number) => void; 
  getOriginalVolume: (id: string) => number | undefined;
}

const AudioManagerContext = createContext<AudioManagerContextType | undefined>(undefined);

export const useAudioManager = () => {
  const context = useContext(AudioManagerContext);
  if (!context) {
    throw new Error('useAudioManager must be used within an AudioManagerProvider');
  }
  return context;
};

interface AudioManagerProviderProps {
  children: ReactNode;
}

export const AudioManagerProvider: React.FC<AudioManagerProviderProps> = ({ children }) => {
  const mediaElementsRef = useRef<Map<string, MediaElementInfo>>(new Map());
  const animationFrameRefs = useRef<Map<string, number>>(new Map()); // To store requestAnimationFrame IDs

  const stopExistingFade = useCallback((id: string) => {
    if (animationFrameRefs.current.has(id)) {
      cancelAnimationFrame(animationFrameRefs.current.get(id)!);
      animationFrameRefs.current.delete(id);
      const mediaInfo = mediaElementsRef.current.get(id);
      if (mediaInfo) {
        mediaInfo.isFadingOut = false;
        mediaInfo.isFadingIn = false;
      }
    }
  }, []);

  const animateVolume = useCallback((id: string, targetVolume: number, duration: number) => {
    stopExistingFade(id);
    const mediaInfo = mediaElementsRef.current.get(id);
    if (!mediaInfo) return;

    const element = mediaInfo.element;
    const startVolume = element.volume;
    const difference = targetVolume - startVolume;
    if (difference === 0) {
        mediaInfo.isFadingIn = targetVolume > startVolume;
        mediaInfo.isFadingOut = targetVolume < startVolume;
        if(element.volume === targetVolume) {
            mediaInfo.isFadingIn = false;
            mediaInfo.isFadingOut = false;
        }
        return; 
    }

    let startTime: number | null = null;

    mediaInfo.isFadingIn = targetVolume > startVolume;
    mediaInfo.isFadingOut = targetVolume < startVolume;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      element.volume = startVolume + difference * progress;

      if (progress < 1) {
        animationFrameRefs.current.set(id, requestAnimationFrame(step));
      } else {
        element.volume = targetVolume; // Ensure it reaches the target
        mediaInfo.isFadingIn = false;
        mediaInfo.isFadingOut = false;
        animationFrameRefs.current.delete(id);
      }
    };
    animationFrameRefs.current.set(id, requestAnimationFrame(step));
  }, [stopExistingFade]);

  const registerMediaElement = useCallback((id: string, element: HTMLMediaElement) => {
    // Ensure element is not null or undefined
    if (!element) {
      console.warn(`AudioManager: Attempted to register null or undefined element for id: ${id}`);
      return;
    }
    // Store with its current volume as original, if not already muted by fadeOutAll
    const mediaInfo = mediaElementsRef.current.get(id);
    mediaElementsRef.current.set(id, {
      element,
      originalVolume: mediaInfo?.isFadingOut ? mediaInfo.originalVolume : element.volume, 
    });
  }, []);

  const unregisterMediaElement = useCallback((id: string) => {
    stopExistingFade(id);
    mediaElementsRef.current.delete(id);
  }, [stopExistingFade]);

  const fadeOutAllExcept = useCallback((exceptId?: string) => {
    mediaElementsRef.current.forEach((info, id) => {
      if (id !== exceptId) {
        if (!info.isFadingOut && info.element.volume > 0) { // Only fade if not already fading out and has volume
          // Preserve current volume as originalVolume before fading
          info.originalVolume = info.element.volume;
          animateVolume(id, 0, FADE_DURATION);
        }
      }
    });
  }, [animateVolume]);

  const fadeToVolume = useCallback((id: string, targetVolume: number, duration: number = FADE_DURATION) => {
    animateVolume(id, Math.max(0, Math.min(1, targetVolume)), duration); // Clamp volume between 0 and 1
  }, [animateVolume]);

  const restoreVolume = useCallback((id: string, duration: number = FADE_DURATION) => {
    const mediaInfo = mediaElementsRef.current.get(id);
    if (mediaInfo) {
      animateVolume(id, mediaInfo.originalVolume, duration);
    }
  }, [animateVolume]);
  
  const getOriginalVolume = useCallback((id: string): number | undefined => {
    return mediaElementsRef.current.get(id)?.originalVolume;
  }, []);

  const value = {
    registerMediaElement,
    unregisterMediaElement,
    fadeOutAllExcept,
    fadeToVolume,
    restoreVolume,
    getOriginalVolume,
  };

  return (
    <AudioManagerContext.Provider value={value}>
      {children}
    </AudioManagerContext.Provider>
  );
}; 