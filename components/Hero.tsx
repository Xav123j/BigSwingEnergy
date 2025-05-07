'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import MuteButton from './ui/MuteButton';
import Image from 'next/image';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useAudioManager } from '@/context/AudioManager';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoIsReady, setVideoIsReady] = useState(false);
  const [initialSectionFadeDone, setInitialSectionFadeDone] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { registerMediaElement, unregisterMediaElement } = useAudioManager();

  const heroVideoSrc = '/videos/hero-compressed-hd1.mp4';
  const heroPosterFallbackSrc = '/images/hero-poster.jpg';

  useEffect(() => {
    const timer = setTimeout(() => setInitialSectionFadeDone(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Register and unregister the video with AudioManager
  useEffect(() => {
    if (videoRef.current) {
      registerMediaElement('hero-video', videoRef.current);
    }
    
    return () => {
      unregisterMediaElement('hero-video');
    };
  }, [registerMediaElement, unregisterMediaElement]);

  // Always show video regardless of reduced motion preference
  const showVideo = true;

  // Add explicit play attempt for the video
  useEffect(() => {
    if (videoRef.current) {
      // Try to play the video
      videoRef.current.play().catch(error => {
        console.warn("Autoplay was prevented:", error);
        // Still show the video even if autoplay fails
        setVideoIsReady(true);
      });
    }
  }, [videoRef.current]);

  // Add a backup timeout to ensure video becomes visible
  useEffect(() => {
    if (!videoIsReady && showVideo) {
      const timer = setTimeout(() => {
        setVideoIsReady(true);
        // Try to play again after delay
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.warn("Delayed play failed:", e));
        }
      }, 500); // Force video to show after 500ms instead of 3000ms
      return () => clearTimeout(timer);
    }
  }, [videoIsReady, showVideo]);

  const handleVideoReady = () => {
    // Immediately set video as ready
    setVideoIsReady(true);
    // Try to play when ready
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.warn("Ready play failed:", e));
    }
  };
  
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: !showVideo ? '#66696f' : '#000000',
    backgroundImage: !showVideo ? `url(${heroPosterFallbackSrc})` : undefined,
    backgroundSize: !showVideo ? 'cover' : undefined,
    backgroundPosition: !showVideo ? 'center' : undefined,
  };

  return (
    <section 
      className={`relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden transition-opacity duration-300 ease-in-out ${initialSectionFadeDone ? 'opacity-100' : 'opacity-0'}`}
      style={sectionStyle}
    >
      {showVideo && (
        <video
          id="hero-video-element"
          ref={videoRef}
          src={heroVideoSrc}
          className={`absolute top-0 left-0 w-full h-full object-cover z-[1] transition-opacity duration-300 ease-in-out ${videoIsReady ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={heroPosterFallbackSrc}
          onCanPlay={handleVideoReady}
          onLoadedData={handleVideoReady}
          onLoadStart={handleVideoReady}
          onError={(e) => {
            console.error('Video error:', e);
            // Show fallback image by setting videoIsReady to true even when video fails
            setVideoIsReady(true);
          }}
        />
      )}
      
      <div className={`absolute inset-0 bg-black z-[2] transition-opacity duration-500 ease-in-out 
        ${showVideo && videoIsReady ? 'opacity-30' : 
         (showVideo && !videoIsReady ? 'opacity-0' : 'opacity-40')}
      `}></div>
      
      <div className="relative z-[3] p-1 md:p-4 flex flex-col items-center justify-center w-full max-w-3xl opacity-100 margin-bottom: -5px mt-16">
        <div className="w-full flex justify-center mb-0">
          <Image
            src="/images/image_logo.png"
            alt="Big Swing Energy"
            width={800}
            height={300}
            priority
            className="w-auto h-auto max-h-[200px] md:max-h-[250px] lg:max-h-[300px]"
          />
        </div>

        <p className="text-base sm:text-lg md:text-xl text-brand-champagne mb-6 max-w-xl md:max-w-2xl mx-auto">
        Quiet swagger, classics re-spun — pure Big Swing Energy.
        </p>
        <Button 
          variant="primary" 
          className="text-base px-8 py-3 md:text-lg md:px-10 md:py-4"
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Book The Quartet
        </Button>
      </div>

      {showVideo && (
        <MuteButton 
          isMuted={isMuted}
          toggleMute={toggleMute} 
          className="fixed z-50 bottom-4 left-6"
        />
      )}
    </section>
  );
};

export default Hero;