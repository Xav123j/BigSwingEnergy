'use client';

import React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import SimpleContactForm from '../SimpleContactForm';

const SimpleContact: React.FC = () => {
  return (
    <SectionWrapper 
      id="contact"
      className="pb-8 pt-1 md:pt-3 bg-black"
      style={{ scrollMarginTop: '5rem' }}
    >
      <div className="text-center mb-6 md:mb-8 mt-4 md:mt-6 px-4 sm:px-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-brand-gold mb-2 md:mb-3">
          Get in Touch
        </h2>
        <p className="text-sm sm:text-base text-brand-champagne/80 max-w-2xl mx-auto font-sans mb-2 text-balance">
          Ready to make your event unforgettable?
        </p>
        <p className="text-sm sm:text-base text-brand-champagne/80 max-w-2xl mx-auto font-sans text-balance">
          Fill out the form below, and we'll get back to you promptly to discuss your needs.
        </p>
      </div>
      
      <div className="max-w-xl mx-auto mt-6 md:mt-8 px-4 sm:px-6 md:px-0">
        <div className="bg-black border border-brand-gold/30 rounded-lg p-4 sm:p-6 shadow-lg">
          <SimpleContactForm />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default SimpleContact; 