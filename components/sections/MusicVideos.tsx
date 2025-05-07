'use client';

import React, { useState, useRef, useEffect } from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import VideoCard from '@/components/video/VideoCard';
import VideoModal from '@/components/video/VideoModal';
import VideoSlide from '@/components/video/VideoSlide';
// Update imports to use correct paths
import { StaticImageData } from 'next/image';

export interface MusicVideo {
  id: string;
  title: string;
  videoSrc: string;      // Path to .mp4 in /public/videos/
  thumbnailSrc: string;  // Path to poster image
  youtubeEmbedSrc?: string; // Optional YouTube embed URL
}

const musicVideoData: MusicVideo[] = [
  {
    id: 'loveYouSo',
    title: 'I LOVE HER SO',
    videoSrc: '/videos/I LOVER HER SO .mp4',
    thumbnailSrc: '/videos/posters/I LOVER HER SO -poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/jemPc5MQvqc?si=LTTiTWrGmseNbw9l'
  },
  {
    id: 'letItBe',
    title: 'LET IT BE',
    videoSrc: '/videos/LET IT BE.mp4',
    thumbnailSrc: '/videos/posters/LET IT BE-poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/K1kVGz5XOhs?si=wsbjWjGaxDNvZaiG'
  },
  {
    id: 'letItSnow',
    title: 'LET IT SNOW',
    videoSrc: '/videos/LET IT SNOW.mp4',
    thumbnailSrc: '/videos/posters/LET IT SNOW-poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/LP2ewrEjUHw?si=sSgyvQXJ-C3K0Y87'
  },
  {
    id: 'love',
    title: 'LOVE',
    videoSrc: '/videos/LOVE.mp4',
    thumbnailSrc: '/videos/posters/LOVE-poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/FryO5rDu6eA?si=tXZ_zl6PpVDlCa8O'
  },
  {
    id: 'makeMyDreams',
    title: 'MAKE MY DREAMS',
    videoSrc: '/videos/MAKE MY DREAMS .mp4',
    thumbnailSrc: '/videos/posters/MAKE MY DREAMS -poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/NDif-Vck58E?si=uvHyndX_TyzrMOLN'
  },
  {
    id: 'rockingCrimbo',
    title: 'ROCKING CRIMBO TREE',
    videoSrc: '/videos/ROCKING CRIMBO TREE .mp4',
    thumbnailSrc: '/videos/posters/ROCKING CRIMBO TREE -poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/LXk3Vd9MzSY?si=CJjahuaKs_G5nMZM'
  },
  {
    id: 'ruleTheWorld',
    title: 'RULE THE WORLD',
    videoSrc: '/videos/RULE THE WORLD .mp4',
    thumbnailSrc: '/videos/posters/RULE THE WORLD -poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/epc2SRRnW2g?si=MVJg-HAuKdDbpyUG'
  },
  {
    id: 'sway',
    title: 'SWAY',
    videoSrc: '/videos/SWAY.mp4',
    thumbnailSrc: '/videos/posters/SWAY-poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/Cd6NCDlybtE?si=wqayLGPk-5vfFCQp'
  },
  {
    id: 'sweetItIs',
    title: 'SWEET IT IS',
    videoSrc: '/videos/SWEET IT IS.mp4',
    thumbnailSrc: '/videos/posters/SWEET IT IS-poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/wFBPzsy0_ac?si=tdDXQ5-JX7kQ7lPW'
  },
  {
    id: 'theseAreTheDays',
    title: 'THESE ARE THE DAYS',
    videoSrc: '/videos/THESE ARE THE DAYS .mp4',
    thumbnailSrc: '/videos/posters/THESE ARE THE DAYS -poster.jpg',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/KyJoaabwMgw?si=OxnFHQBRBhfN3VoE'
  },
];

const MusicVideos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<MusicVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize scrolling setup
  useEffect(() => {
    // Wait for layout to be ready
    if (!hasInitialized && scrollContainerRef.current) {
      const initializeScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Clean scrolling setup
        container.scrollLeft = 0;
        
        // Force a layout recalculation
        window.requestAnimationFrame(() => {
          // Start at the first slide
          container.scrollLeft = 0;
          
          // Mark as initialized
          setHasInitialized(true);
          
          // Check the scroll position
          checkScrollPosition();
          
          console.log("Videos scroll initialized", {
            scrollWidth: container.scrollWidth,
            clientWidth: container.clientWidth,
            scrollLeft: container.scrollLeft
          });
        });
      };
      
      // Delay initialization slightly to ensure DOM is ready
      setTimeout(initializeScroll, 500);
    }
  }, [hasInitialized]);

  // Check scroll position to determine if arrows should be shown
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if we can scroll left
    setCanScrollLeft(container.scrollLeft > 20);
    
    // Check if we can scroll right
    const maxScrollLeft = container.scrollWidth - container.clientWidth - 20;
    setCanScrollRight(container.scrollLeft < maxScrollLeft);
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -window.innerWidth,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: window.innerWidth,
      behavior: 'smooth'
    });
  };

  const openModal = (video: MusicVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null); // Clear selected video after a delay to allow exit animation
  };

  // Create pairs of videos for each slide (2 videos per slide)
  const videoSlides = [];
  for (let i = 0; i < musicVideoData.length; i += 2) {
    const pair = musicVideoData.slice(i, i + 2);
    videoSlides.push(pair);
  }

  return (
    <>
      <SectionWrapper
        id="music" // Changed ID to music (from music-videos for nav consistency)
        className="min-h-screen flex flex-col items-center justify-center bg-brand-champagne py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="container mx-auto max-w-container text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-brand-black mb-4">
            Live Performances
          </h2>
          <p className="text-lg text-brand-black/70 mb-12 max-w-2xl mx-auto font-sans">
            Experience the energy and artistry of our live shows. Click on any performance to watch the video.
          </p>
          
          {/* Horizontal scrolling container with slides */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth"
            tabIndex={0}
            aria-label="Video gallery slideshow, use arrow keys to navigate"
          >
            {videoSlides.map((slidePair, index) => (
              <VideoSlide key={`slide-${index}`}>
                <div className="flex items-center justify-center h-full">
                  <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                      {slidePair.map((video) => (
                        <VideoCard 
                          key={video.id}
                          title={video.title}
                          thumbnailSrc={video.thumbnailSrc}
                          onClick={() => openModal(video)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </VideoSlide>
            ))}
          </div>
          
          {/* Navigation Arrows (Desktop only) */}
          <div className="absolute top-1/2 left-4 hidden md:block z-10">
            <button 
              onClick={scrollLeft}
              className="p-2 rounded-full bg-brand-midnight-blue/20 text-brand-black hover:text-brand-gold transition-colors"
              aria-label="Previous video slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <div className="absolute top-1/2 right-4 hidden md:block z-10">
            <button 
              onClick={scrollRight}
              className="p-2 rounded-full bg-brand-midnight-blue/20 text-brand-black hover:text-brand-gold transition-colors"
              aria-label="Next video slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </SectionWrapper>

      {selectedVideo && (
        <VideoModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          videoSrc={selectedVideo.videoSrc}
          videoTitle={selectedVideo.title}
          videoPoster={selectedVideo.thumbnailSrc}
          youtubeEmbedSrc={selectedVideo.youtubeEmbedSrc}
        />
      )}
    </>
  );
};

export default MusicVideos; 