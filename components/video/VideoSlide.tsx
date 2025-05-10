import React from 'react';

interface VideoSlideProps {
  children: React.ReactNode;
  className?: string;
}

const VideoSlide: React.FC<VideoSlideProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full flex-shrink-0 flex-grow-0 ${className}`}>
      {children}
    </div>
  );
};

export default VideoSlide; 