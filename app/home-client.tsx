'use client';

import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import StorySection from '@/components/sections/StorySection';
import GallerySectionDesktop from '@/components/sections/GallerySectionDesktop';
import GallerySectionMobile from '@/components/sections/GallerySectionMobile';
import MusicVideos from '@/components/sections/MusicVideos';
import SimpleContact from '@/components/sections/SimpleContact';
import useIsMobile from '@/hooks/useIsMobile';

export default function HomeClient() { // Renamed from Home
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

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