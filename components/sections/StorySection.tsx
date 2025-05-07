import React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
// import Image from 'next/image'; 
// import storyPlaceholder from '@/public/images/story-placeholder.jpg';

const StorySection: React.FC = () => {
  return (
    <SectionWrapper 
      id="BSE"
      className="min-h-screen flex items-center justify-center bg-brand-midnight-blue py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto max-w-container grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h3 className="text-xl font-semibold text-brand-gold uppercase tracking-wider mb-3 font-sans">
            Big Swing Energy
          </h3>
          <h2 className="text-4xl md:text-4xl font-serif text-brand-champagne mb-6">
            Timeless Classics, Served With A Twist
          </h2>
          <div className="space-y-4 text-brand-champagne/80 leading-relaxed font-sans">
            <p>
              Big Swing Energy is Manchester's smoothest pour of jazz—smoky,
              sharp, and served with a twist. This quartet blends timeless
              sophistication with just enough bite to keep things interesting. Fronted
              by velvet-voiced crooner Robbie, with Ollie shaking up the keys,
              Roberto laying down that rich double bass groove, and Xavier stirring it
              all together on drums, Big Swing Energy brings the classics to life—and
              reimagines pop hits with jazzy swagger. Whether you're sipping
              something strong or dancing 'til last orders, these cats serve their sets
              like a good cocktail: bold, balanced, and never boring.
            </p>
          </div>
        </div>
        <div className="order-1 md:order-2 h-full min-h-[300px] md:min-h-[400px] max-h-[500px] md:max-h-[600px] w-full relative bg-brand-champagne/10 rounded-lg shadow-2xl flex items-center justify-center">
          {/* <Image 
            src={storyPlaceholder}
            alt="Jazz quartet performing live"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-2xl"
            placeholder="blur"
            priority
          /> */}
          <p className="text-brand-champagne/50 font-sans">Image Placeholder (story-placeholder.jpg)</p>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default StorySection; 