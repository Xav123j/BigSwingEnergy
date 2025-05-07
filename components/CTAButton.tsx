'use client';

import React from 'react';
import Button from './ui/Button'; // Using the reusable Button

const CTAButton: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 z-40 w-full md:w-auto">
      {/* Mobile: Full-width bar at the bottom */}
      <div className="md:hidden">
        <Button 
          variant="primary" 
          className="w-full text-lg py-4 shadow-lg"
          onClick={scrollToContact}
        >
          Book The Quartet
        </Button>
      </div>

      {/* Desktop: Pill button bottom-right */}
      <div className="hidden md:block">
        <Button 
          variant="primary" 
          className="shadow-lg text-base px-8 py-3"
          onClick={scrollToContact}
        >
          Book The Quartet
        </Button>
      </div>
    </div>
  );
};

export default CTAButton; 