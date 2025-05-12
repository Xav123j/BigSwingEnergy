'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import SongList from '@/components/song/SongList';
import { useVideoContext } from '@/context/VideoContext';
import { videos } from '@/data/videos';

// Dynamically imported components with no SSR
const SongDrawer = dynamic(() => import('@/components/song/SongDrawer'), { ssr: false });
const VideoModal = dynamic(() => import('@/components/video/VideoModal'), { ssr: false });

const VideoSection: React.FC = () => {
  const { setIsDrawerOpen, setCurrentVideoId, setIsModalOpen, currentVideoId } = useVideoContext();
  const [isMobile, setIsMobile] = useState(false);
  
  // Set the first video as default when component mounts and none is selected
  useEffect(() => {
    if (!currentVideoId && videos.length > 0) {
      setCurrentVideoId(videos[0].id);
    }
  }, [currentVideoId, setCurrentVideoId]);

  // Get the current video to display
  const featuredVideo = currentVideoId 
    ? videos.find(v => v.id === currentVideoId) 
    : videos[0];
  
  // Log for debugging
  console.log('Featured video:', featuredVideo);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <SectionWrapper
      id="music"
      className="min-h-screen bg-brand-champagne pt-[50px] pb-16 md:pt-[80px] md:pb-24 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="container mx-auto max-w-container text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-black mb-4">
          Live Performances
        </h2>
        <p className="text-lg text-brand-black/70 mb-6 max-w-2xl mx-auto font-sans">
        {/* Select from the list below. */}
        </p>
      </div>

      {/* Desktop two-column layout */}
      <div className="grid md:grid-cols-[17rem_1fr] xl:grid-cols-[20rem_1fr] gap-6 xl:gap-10 container mx-auto max-w-container">
        {/* Left column - Song list (desktop only) */}
        <div className="hidden md:block sticky top-24 h-[517px] max-h-[calc(100vh-12rem)] rounded-xl shadow-md bg-white/90 backdrop-blur-sm border border-brand-gold/20">
          <SongList className="max-h-[calc(100vh-18rem)]" />
        </div>

        {/* Right column - Featured Video (large single video) */}
        {featuredVideo && (
          <div className="h-full flex flex-col">
            <div 
              className="relative aspect-video w-full rounded-xl overflow-hidden shadow-xl group cursor-pointer transition-transform hover:scale-[1.01] border border-brand-gold/30"
              onClick={() => {
                setCurrentVideoId(featuredVideo.id);
                setIsModalOpen(true);
              }}
            >
              <Image
                src={featuredVideo.poster}
                alt={`${featuredVideo.title} thumbnail`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                className="object-cover"
                priority
              />
              
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight-blue/70 via-transparent to-transparent" />
              
              {/* Title card */}
              <div className="absolute top-0 left-0 right-0 p-6 transform transition-all">
                <h3 className="text-3xl font-serif text-brand-gold mb-2">
                  {featuredVideo.title}
                </h3>
                <p className="text-lg text-white/90">
                  {featuredVideo.artist}
                </p>
              </div>
              
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 rounded-full bg-brand-gold/80 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white ml-1">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Video description/runtime */}
            <div className="mt-4 flex items-center justify-between">
              {/* <p className="text-lg text-brand-black/80">
                Watch the band perform at exclusive venues across the country
              </p> */}
              {/* <span className="text-sm text-brand-black/60 bg-brand-midnight-blue/5 px-3 py-1 rounded-full">
                {featuredVideo.runtime}
              </span> */}
            </div>
          </div>
        )}
      </div>

      {/* Mobile song list - shown below video */}
      {isMobile && (
        <div className="md:hidden mt-8 rounded-xl shadow-md bg-white/90 backdrop-blur-sm border border-brand-gold/20">
          <SongList className="max-h-[400px]" />
        </div>
      )}

      {/* Drawer and Modal (these are dynamically imported) */}
      <SongDrawer />
      <VideoModal />
    </SectionWrapper>
  );
};

export default VideoSection; 