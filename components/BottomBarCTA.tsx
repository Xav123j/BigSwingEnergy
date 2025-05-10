'use client';

import React from 'react';
import Button from './ui/Button';

const BottomBarCTA: React.FC = () => {
  const handleClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full py-3 bg-black/80 backdrop-blur border-t border-brand-gold/30 z-40 md:hidden">
      <div className="container mx-auto px-4">
        <Button
          variant="primary"
          onClick={handleClick}
          className="w-full py-3 text-base font-medium touch-target"
        >
          Book The Quartet
        </Button>
      </div>
    </div>
  );
};

export default BottomBarCTA; 