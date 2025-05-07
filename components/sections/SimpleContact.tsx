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
      <div className="text-center mb-8 mt-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-gold mb-3">
          Get in Touch
        </h2>
        <p className="text-brand-champagne/80 max-w-2xl mx-auto font-sans mb-2">
          Ready to make your event unforgettable?
        </p>
        <p className="text-brand-champagne/80 max-w-2xl mx-auto font-sans">
          Fill out the form below, and we'll get back to you promptly to discuss your needs.
        </p>
      </div>
      
      <div className="max-w-xl mx-auto mt-8">
        <div className="bg-black border border-brand-gold/30 rounded-lg p-6 shadow-lg">
          <SimpleContactForm />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default SimpleContact; 