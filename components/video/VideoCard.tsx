'use client';

import React from 'react';
import Image from 'next/image';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { StaticImageData } from 'next/image';

interface VideoCardProps {
  title: string;
  thumbnailSrc: string | StaticImageData; // Accept either a string path or a StaticImageData object
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, thumbnailSrc, onClick }) => {
  return (
    <div 
      className="relative aspect-video rounded-xl overflow-hidden shadow-xl group cursor-pointer 
                 border-2 border-transparent hover:border-brand-gold transition-all duration-300 
                 focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold focus-within:ring-offset-2 focus-within:ring-offset-brand-champagne"
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      tabIndex={0} // Make it focusable
      role="button"
      aria-label={`Play video: ${title}`}
    >
      <Image 
        src={thumbnailSrc}
        alt={`Thumbnail for ${title}`}
        layout="fill"
        objectFit="cover"
        className="transform transition-transform duration-500 ease-in-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <h3 className="text-brand-champagne font-semibold font-sans text-xl md:text-2xl drop-shadow-md">
          {title}
        </h3>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        <PlayCircleIcon className="h-20 w-20 text-brand-gold drop-shadow-xl"/>
      </div>
    </div>
  );
};

export default VideoCard; 