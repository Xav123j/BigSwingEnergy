'use client';

import React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';

const musicStyles = [
  {
    title: 'Smooth & Soulful',
    description: [
      'Velvet tones for sophisticated evenings.',
      'Perfect for cocktails and conversation.',
      'Timeless classics and gentle rhythms.',
      'Creates an atmosphere of pure elegance.',
      'Subtle, yet captivating musical artistry.'
    ],
  },
  {
    title: 'Upbeat & Swinging',
    description: [
      'Energetic vibes to liven any event.',
      'Iconic big band sounds, quartet style.',
      'Get your guests tapping their feet.',
      'A vibrant journey through jazz eras.',
      'Guaranteed to bring smiles and energy.'
    ],
  },
  {
    title: 'Cool & Contemporary',
    description: [
      'Modern jazz with a sophisticated twist.',
      'Unique arrangements of familiar tunes.',
      'Fresh sounds for the discerning listener.',
      'Innovative improvisations, classic feel.',
      'The perfect blend of old and new school.'
    ],
  },
];

const MusicSection: React.FC = () => {
  return (
    <SectionWrapper 
      id="music"
      className="min-h-screen flex flex-col items-center justify-center bg-brand-champagne py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto max-w-container text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-black mb-4">
          Our Music
        </h2>
        <p className="text-lg text-brand-black/70 mb-12 max-w-2xl mx-auto font-sans">
          We offer a versatile repertoire to perfectly match the ambiance of your event. Explore some of our signature styles below.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {musicStyles.map((style) => (
            <Card key={style.title} title={style.title} hoverEffect className="text-left border-brand-midnight-blue/20 bg-brand-champagne/70">
              <ul className="space-y-2 mb-6 font-sans text-sm text-brand-black/80">
                {style.description.map((line, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-brand-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    {line}
                  </li>
                ))}
              </ul>
              <Button 
                variant="secondary" 
                className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black focus-visible:ring-offset-brand-champagne"
                onClick={() => console.log(`Play button for ${style.title} clicked`)}
              >
                Listen (Coming Soon)
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default MusicSection; 