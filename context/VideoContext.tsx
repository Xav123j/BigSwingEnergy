'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { VideoData, videos } from '@/data/videos';

interface VideoContextType {
  currentVideoId: string | null;
  setCurrentVideoId: (id: string | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  getCurrentVideo: () => VideoData | undefined;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getCurrentVideo = () => {
    if (!currentVideoId) return undefined;
    return videos.find(video => video.id === currentVideoId);
  };

  return (
    <VideoContext.Provider
      value={{
        currentVideoId,
        setCurrentVideoId,
        isModalOpen,
        setIsModalOpen,
        isDrawerOpen,
        setIsDrawerOpen,
        getCurrentVideo
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
}; 