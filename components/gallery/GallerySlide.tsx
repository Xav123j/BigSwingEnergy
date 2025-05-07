import React from 'react';

interface GallerySlideProps {
  children: React.ReactNode;
}

const GallerySlide: React.FC<GallerySlideProps> = ({ children }) => {
  return (
    <div className="w-full flex-shrink-0 flex-grow-0">
      {children}
    </div>
  );
};

export default GallerySlide; 