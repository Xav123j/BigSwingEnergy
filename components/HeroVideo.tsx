'use client';

import React, { useState, useEffect, useRef } from 'react';
import MuteButton from './ui/MuteButton'; // Assuming MuteButton is still needed here or passed as prop
import { useAudioManager } from '@/context/AudioManager';

interface HeroVideoProps {
  // Props can be added if needed, e.g., to control initial mute state from parent
}

const HeroVideo: React.FC<HeroVideoProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for autoplay
  const [videoIsReady, setVideoIsReady] = useState(false);
  const { registerMediaElement, unregisterMediaElement } = useAudioManager();
  
  const heroVideoSrc = '/videos/hero-compressed-hd1.mp4'; // This path needs to be public
  const heroPosterFallbackSrc = '/images/hero-poster.webp'; // This path needs to be public

  // This useEffect now handles video setup
  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = isMuted; // Ensure video respects the isMuted state
    videoRef.current.loop = true; // Explicitly ensure looping is enabled
    registerMediaElement('hero-video', videoRef.current);
    
    // Attempt to play the video
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Autoplay started!
        setVideoIsReady(true);
        console.log("Hero video autoplay started.");
      }).catch(error => {
        // Autoplay was prevented.
        console.warn('Hero video autoplay was prevented:', error);
        setVideoIsReady(true); 
      });
    } else {
      setVideoIsReady(true);
    }
    
    return () => {
      unregisterMediaElement('hero-video');
    };
  }, [isMuted, registerMediaElement, unregisterMediaElement]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted; // Directly apply to video element
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        src={heroVideoSrc}
        className={`absolute top-0 left-0 w-full h-full object-cover z-[1] transition-opacity duration-500 ${videoIsReady ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        loop
        muted // Start muted for autoplay to work on mobile
        playsInline // Essential for mobile autoplay
        preload="auto" // Changed from "metadata" to "auto" as video is now lazy loaded
        poster={heroPosterFallbackSrc} // Shows while video loads or if it fails
        onLoadedData={() => {
          console.log("Hero video onLoadedData triggered");
        }}
        onCanPlay={() => {
           console.log("Hero video onCanPlay triggered, attempting play if not already.");
           if (videoRef.current && videoRef.current.paused && !videoIsReady) {
              videoRef.current.play().then(() => setVideoIsReady(true)).catch(e => console.warn("onCanPlay play() failed", e));
           }
        }}
      />
      {videoIsReady && (
        <MuteButton 
          isMuted={isMuted}
          toggleMute={toggleMute} 
          className="fixed z-50 bottom-20 md:bottom-4 left-4 md:left-6" // This might need adjustment if it's part of the main Hero layout
        />
      )}
    </>
  );
};

export default HeroVideo; 