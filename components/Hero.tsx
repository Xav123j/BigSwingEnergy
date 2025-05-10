'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import MuteButton from './ui/MuteButton';
import Image from 'next/image';
import { useAudioManager } from '@/context/AudioManager';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for autoplay
  const [videoIsReady, setVideoIsReady] = useState(false);
  const { registerMediaElement, unregisterMediaElement } = useAudioManager();
  
  // State to determine if we should attempt to show/play video (for SSR and initial load)
  // We can rely on CSS to hide it initially if needed, or use this state.
  // For now, let's assume we always try to render the video tag.
  const [isClient, setIsClient] = useState(false);
  
  const heroVideoSrc = '/videos/hero-compressed-hd1.mp4';
  const heroPosterFallbackSrc = '/images/hero-poster.jpg';

  useEffect(() => {
    setIsClient(true); // Set isClient to true once component mounts
  }, []);

  // This useEffect now handles video setup for both mobile and desktop
  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = isMuted; // Ensure video respects the isMuted state
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
        // Show video poster or a fallback if play fails, videoIsReady can still be true to show the element
        setVideoIsReady(true); 
      });
    } else {
      // If play() doesn't return a promise (older browsers), assume it worked or will show via attributes
      setVideoIsReady(true);
    }
    
    return () => {
      unregisterMediaElement('hero-video');
    };
  }, [isMuted, registerMediaElement, unregisterMediaElement, isClient]); // Added isClient to re-run when it becomes true
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted; // Directly apply to video element
    }
  };
  
  // Use a simpler approach for background: video will overlay it.
  // The poster attribute on the video tag will serve as the initial background.
  const sectionStyle = {
    backgroundColor: '#000000', // Base background color
  };

  return (
    <section 
      className="relative h-screen min-h-[500px] sm:min-h-[600px] flex items-center justify-center text-center overflow-hidden"
      style={sectionStyle}
      id="Hero"
    >
      {/* Video is now always rendered, relies on attributes and play() attempt */}
      {isClient && ( // Only render video tag on the client to avoid hydration mismatches with videoRef
        <video
          ref={videoRef}
          src={heroVideoSrc}
          className={`absolute top-0 left-0 w-full h-full object-cover z-[1] transition-opacity duration-500 ${videoIsReady ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          loop
          muted // Start muted for autoplay to work on mobile
          playsInline // Essential for mobile autoplay
          preload="auto"
          poster={heroPosterFallbackSrc} // Shows while video loads or if it fails
          onLoadedData={() => {
            // setVideoIsReady(true); // Play attempt in useEffect will set this
            console.log("Hero video onLoadedData triggered");
          }}
          onCanPlay={() => {
             console.log("Hero video onCanPlay triggered, attempting play if not already.");
             if (videoRef.current && videoRef.current.paused && !videoIsReady) {
                // Fallback play attempt if initial one in useEffect was too early
                videoRef.current.play().then(() => setVideoIsReady(true)).catch(e => console.warn("onCanPlay play() failed", e));
             }
          }}
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black z-[2] opacity-15"></div>
      
      {/* Content */}
      <div className="relative z-[3] p-1 md:p-4 flex flex-col items-center justify-center w-full max-w-3xl mt-8 md:mt-16 px-4 sm:px-6">
        <div className="w-full flex justify-center mb-0">
          <Image
            src="/images/image_logo.png"
            alt="Big Swing Energy"
            width={800}
            height={300}
            priority
            className="w-auto h-auto max-h-[130px] sm:max-h-[200px] md:max-h-[250px] lg:max-h-[300px]"
          />
        </div>

        <p className="text-base sm:text-lg md:text-xl leading-normal text-brand-champagne mb-6 max-w-xl md:max-w-2xl mx-auto text-center sm:whitespace-nowrap">
          Quiet swagger, classics re-spun
          <span className="block sm:inline"> — pure Big Swing Energy.</span>
        </p>
        <Button 
          variant="primary" 
          className="text-base px-6 py-3 md:text-lg md:px-10 md:py-4"
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Book The Quartet
        </Button>
      </div>

      {/* Mute button can be shown on both mobile and desktop if desired, or kept desktop only */}
      {/* For now, let's assume videoIsReady implies we can show mute button */}
      {videoIsReady && (
        <MuteButton 
          isMuted={isMuted}
          toggleMute={toggleMute} 
          className="fixed z-50 bottom-20 md:bottom-4 left-4 md:left-6"
        />
      )}
    </section>
  );
};

export default Hero;