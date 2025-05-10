'use client';

import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import StorySection from '@/components/sections/StorySection';
// import GallerySection from '@/components/sections/GallerySection'; // Comment out the old import
import GallerySectionDesktop from '@/components/sections/GallerySectionDesktop'; // Import the new Desktop version
import GallerySectionMobile from '@/components/sections/GallerySectionMobile'; // Import the Mobile version
// We will import GallerySectionMobile later when we implement the switcher
import MusicVideos from '@/components/sections/MusicVideos';
import SimpleContact from '@/components/sections/SimpleContact';
import useIsMobile from '@/hooks/useIsMobile'; // Import the new hook

export default function Home() {
  const isMobile = useIsMobile(); // Use the hook to check screen size

  useEffect(() => {
    // Ensure the window is scrolled to the top right after the initial render.
    // 'instant' behavior prevents any visual jump.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  return (
    <>
      <Hero />
      <StorySection />
      <MusicVideos />
      {isMobile ? <GallerySectionMobile /> : <GallerySectionDesktop />}
      <SimpleContact />
    </>
  );
} 