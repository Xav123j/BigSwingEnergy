import React from 'react';
import Hero from '@/components/Hero';
import StorySection from '@/components/sections/StorySection';
import GallerySection from '@/components/sections/GallerySection';
import MusicVideos from '@/components/sections/MusicVideos';
import SimpleContact from '@/components/sections/SimpleContact';

export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      <MusicVideos />
      <GallerySection />
      <SimpleContact />
    </>
  );
} 