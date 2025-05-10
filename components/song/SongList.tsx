'use client';

import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { videos } from '@/data/videos';
import SongRow from './SongRow';
import { useVideoContext } from '@/context/VideoContext';

interface SongListProps {
  className?: string;
}

const SongList: React.FC<SongListProps> = ({ className = '' }) => {
  const { currentVideoId, setCurrentVideoId } = useVideoContext();
  const listRef = useRef<HTMLDivElement>(null);
  const activeIndex = videos.findIndex(v => v.id === currentVideoId);
  const isInitialMountRef = useRef(true);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!videos.length) return;
    
    let newIndex = activeIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = activeIndex < videos.length - 1 ? activeIndex + 1 : activeIndex;
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = activeIndex > 0 ? activeIndex - 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = videos.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== activeIndex) {
      setCurrentVideoId(videos[newIndex].id);
    }
  };

  // Scroll active item into view when it changes
  useEffect(() => {
    // if (activeIndex >= 0 && listRef.current) { // Temporarily comment out to test scroll issue
    //   if (isInitialMountRef.current) { 
    //     isInitialMountRef.current = false; 
    //   } else {
    //     const activeElement = listRef.current.querySelector(`#song-option-${videos[activeIndex].id}`);
    //     activeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    //   }
    // }
  }, [activeIndex]);

  return (
    <div 
      className={`flex flex-col overflow-hidden rounded-xl h-full ${className}`}
      role="listbox"
      aria-label="Song list"
      aria-activedescendant={currentVideoId ? `song-option-${currentVideoId}` : undefined}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={listRef}
    >
      <div className="px-4 py-3 border-b border-brand-gold/20 bg-gradient-to-r from-brand-gold/5 to-brand-gold/10 shrink-0">
        <h2 className="text-xl font-serif text-brand-black flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-brand-gold">
            <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z" clipRule="evenodd" />
          </svg>
          Song List
        </h2>
        <p className="text-xs text-brand-black/60 mt-1 ml-7">
          Select a song to view
        </p>
      </div>
      
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-brand-gold/20 scrollbar-track-transparent flex-grow">
        {videos.map((video, index) => (
          <SongRow
            key={video.id}
            video={video}
            index={index}
            isActive={video.id === currentVideoId}
          />
        ))}
      </div>
      
      {/* Help text at bottom */}
      {/* <div className="px-3 py-2 text-xs text-brand-black/40 text-center border-t border-brand-gold/10 bg-white/80 shrink-0">
        Use ↑/↓ keys to navigate
      </div> */}
    </div>
  );
};

export default SongList; 