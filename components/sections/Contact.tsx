'use client';

import React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
// Import InfoBar but we'll comment it out for now
// import InfoBar from '@/components/contact/InfoBar';
import EnquiryForm from '@/components/contact/EnquiryForm';

const Contact: React.FC = () => {
  return (
    <SectionWrapper
      id="contact"
      className="pb-16 pt-24 md:pt-20 bg-black"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-gold mb-3">
          Get in Touch
        </h2>
        <p className="text-brand-champagne/80 max-w-2xl mx-auto font-sans">
          Ready to bring the energy of jazz to your event? Fill out the enquiry form below and we'll get back to you within 24 hours.
        </p>
      </div>

      {/* Wider container for the form */}
      <div className="max-w-4xl mx-auto mt-8">
        {/* InfoBar commented out
        <div className="lg:col-span-1">
          <InfoBar />
        </div>
        */}
        <div className="bg-black border border-brand-gold/30 rounded-lg p-5 shadow-lg">
          <EnquiryForm />
        </div>
      </div>

      {/* <div className="mt-16 text-center">
        <p className="text-lg text-brand-champagne italic font-sans">
          "The band brought incredible energy to our wedding reception. Highly recommended!" — Sarah & James
        </p>
      </div> */}
    </SectionWrapper>
  );
};

export default Contact; 