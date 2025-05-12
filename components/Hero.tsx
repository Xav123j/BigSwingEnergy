'use client';

import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import HeroVideo, ensuring it only loads on client-side and shows no loading indicator.
const HeroVideo = dynamic(() => import('./HeroVideo'), { 
  ssr: false, 
  loading: () => null // As per instruction: loading:()=><></>
});

const Hero: React.FC = () => {
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    // Use requestIdleCallback to delay loading the video component
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => {
        setLoadVideo(true);
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      // Load it after a short delay to allow critical content to render first
      const timer = setTimeout(() => {
        setLoadVideo(true);
      }, 200); // 200ms delay as a fallback
      return () => clearTimeout(timer);
    }
  }, []);
  
  const sectionStyle = {
    backgroundColor: '#000000', // Base background color
  };

  return (
    <section 
      className="relative h-screen min-h-[500px] sm:min-h-[600px] flex items-center justify-center text-center overflow-hidden"
      style={sectionStyle}
      id="Hero"
    >
      {/* Static placeholder image - visible by default and prioritized */}
      <Image
        src="/assets/og/bigswingenergy-hero.webp" // Path to the new WebP still
        alt="Big Swing Energy band performing on stage" // Descriptive alt text
        layout="fill"
        objectFit="cover"
        priority // Critical above-the-fold image
        className="absolute top-0 left-0 w-full h-full object-cover z-[1]" 
      />
      
      {/* Lazy-loaded video component */}
      {loadVideo && <HeroVideo />}
      
      {/* Overlay */}
      {/* WCAG Contrast: Consider increasing opacity if text contrast over video is an issue, e.g., bg-black/30 or bg-black/40, or add text shadow to text elements. */}
      <div className="absolute inset-0 bg-black z-[2] opacity-15"></div>
      
      {/* Content */}
      <div className="relative z-[3] p-1 md:p-4 flex flex-col items-center justify-center w-full max-w-3xl mt-8 md:mt-16 px-4 sm:px-6">
        <div className="w-full flex justify-center mb-0">
          <Image
            src="/images/image_logo.webp" // This will be converted to WebP in a later step
            alt="Big Swing Energy band logo"
            width={800}
            height={300}
            priority // This logo is also critical above the fold
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

      {/* MuteButton is now part of HeroVideo component and will be rendered there if video loads */}
    </section>
  );
};

export default Hero;