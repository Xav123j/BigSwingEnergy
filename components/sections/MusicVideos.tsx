'use client';

import React from 'react';
import VideoSection from '@/components/VideoSection';
import { VideoProvider } from '@/context/VideoContext';

const MusicVideos: React.FC = () => {
  return (
    <VideoProvider>
      <VideoSection />
    </VideoProvider>
  );
};

export default MusicVideos; 