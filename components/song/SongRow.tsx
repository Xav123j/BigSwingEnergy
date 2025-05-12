'use client';

import React from 'react';
import { VideoData } from '@/data/videos';
import { useVideoContext } from '@/context/VideoContext';

interface SongRowProps {
  video: VideoData;
  isActive?: boolean;
  index: number;
}

const SongRow: React.FC<SongRowProps> = ({ video, isActive = false, index }) => {
  const { setCurrentVideoId, setIsModalOpen } = useVideoContext();

  const handleSelect = () => {
    setCurrentVideoId(video.id);
    setIsModalOpen(true);
  };

  return (
    <div
      className={`group relative flex items-center py-2.5 px-3 cursor-pointer transition-all
        hover:bg-brand-midnight-blue/5 hover:pl-4
        ${isActive ? 'bg-brand-midnight-blue/10 pl-4' : ''}`}
      onClick={handleSelect}
      role="option"
      aria-selected={isActive}
      id={`song-option-${video.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      {/* Left gold border indicator */}
      <div className={`absolute left-0 top-0 h-full w-0.5 transition-all ${
        isActive 
          ? 'bg-brand-gold' 
          : 'bg-brand-gold/0 group-hover:bg-brand-gold/50'
      }`} />
      
      {/* Song number with gold accent for active item */}
      <div className={`w-6 flex-shrink-0 text-right mr-2 font-mono text-sm ${
        isActive ? 'text-brand-gold' : 'text-brand-black/50 group-hover:text-brand-black/70'
      }`}>
        {index + 1}.
      </div>
      
      <div className="flex-grow min-w-0 flex items-center">
        {/* Song title and artist */}
        <div className="flex-grow">
          <h3 className={`font-serif text-sm truncate leading-tight ${
            isActive ? 'text-brand-black' : 'text-brand-black/80'
          }`}>
            {video.title}
          </h3>
          
          <p className="text-xs text-brand-black/60 truncate">
            {video.artist}
          </p>
        </div>
        
        {/* Play icon - only visible on hover or active */}
        <div className={`ml-2 transform transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
            className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-brand-black/70'}`}>
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SongRow; 