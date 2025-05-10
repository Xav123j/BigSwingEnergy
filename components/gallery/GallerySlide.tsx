import React from 'react';

interface GallerySlideProps {
  children: React.ReactNode;
  className?: string;
}

const GallerySlide: React.FC<GallerySlideProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full flex-shrink-0 flex-grow-0 ${className}`}>
      {children}
    </div>
  );
};

export default GallerySlide; 