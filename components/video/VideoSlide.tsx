import React from 'react';

interface VideoSlideProps {
  children: React.ReactNode;
}

const VideoSlide: React.FC<VideoSlideProps> = ({ children }) => {
  return (
    <div className="w-full flex-shrink-0 flex-grow-0">
      {children}
    </div>
  );
};

export default VideoSlide; 