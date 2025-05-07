'use client';

import React from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'; // Using solid for better visibility

interface MuteButtonProps {
  isMuted: boolean;
  toggleMute: () => void;
  className?: string;
}

const MuteButton: React.FC<MuteButtonProps> = ({ isMuted, toggleMute, className }) => {
  return (
    <button
      onClick={toggleMute}
      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      aria-pressed={!isMuted} // Indicates if sound is ON
      className={`p-2 rounded-full bg-black/30 hover:bg-black/50 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 transition-all ${className}`}
    >
      {isMuted ? (
        <SpeakerXMarkIcon className="h-5 w-5 md:h-6 md:w-6" />
      ) : (
        <SpeakerWaveIcon className="h-5 w-5 md:h-6 md:w-6" />
      )}
    </button>
  );
};

export default MuteButton; 