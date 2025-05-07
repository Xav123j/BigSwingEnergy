import React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import ContactForm from '../ContactForm';

const ContactSection: React.FC = () => {
  return (
    <SectionWrapper 
      id="contact"
      className="min-h-screen flex flex-col items-center justify-center bg-brand-black py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto max-w-container text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-champagne mb-4">
          Get in Touch
        </h2>
        <p className="text-lg text-brand-champagne/70 mb-10 max-w-xl mx-auto font-sans">
          Ready to make your event unforgettable? Fill out the form below, and we'll get back to you promptly to discuss your needs.
        </p>
        <div className="flex justify-center w-full">
          <ContactForm />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection; 