'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import Image from 'next/image';
import GallerySlide from '@/components/gallery/GallerySlide';
// No useAutoHorizontalScroll hook import here, as this is for mobile without auto-scroll

// Define a proper interface for gallery items
interface GalleryItem {
  src: string;
  alt: string;
  colSpan?: string;
  rowSpan?: string;
  objectPosition?: string;
  isLogo?: boolean;
  keepSquare?: boolean;
  fullColor?: boolean;
  scale?: number;
}

// Slide 1: Mix performance with logo
const galleryItems = [
  { src: '/images/7.webp', alt: 'These Are The Days', colSpan: 'md:col-span-2', objectPosition: 'center 30%' },
  { 
    src: '/images/5.webp', 
    alt: 'Love performance', 
    colSpan: 'md:col-span-1', 
    objectPosition: 'center center',
    isLogo: true,
    keepSquare: true,
    scale: 0.9
  },
  { 
    src: '/images/1.webp', 
    alt: 'Make My Dreams', 
    rowSpan: 'md:row-span-2', 
    objectPosition: 'center center',
    fullColor: false  // Flag to display in full color
  },
];

// Slide 2: Different mix
const galleryItems2 = [
  { src: '/images/2.webp', alt: 'The band interacting with the audience', colSpan: 'md:col-span-2', objectPosition: 'center 40%' },
  { 
    src: '/images/6.webp', 
    alt: 'Make My Dreams', 
    rowSpan: 'md:row-span-2', 
    objectPosition: 'center center',
    fullColor: true  // Flag to display in full color
  },
  { src: '/images/15.webp', alt: 'Rule The World', rowSpan: 'md:row-span-2', objectPosition: '70% center' },
  
];

// Slide 3: Another mix
const galleryItems3 = [
  { src: '/images/17.webp', alt: 'Rocking Christmas Tree performance', colSpan: 'md:col-span-2', objectPosition: 'center center' },
  { src: '/images/10.webp', alt: 'Overhead shot of the quartet in action', rowSpan: 'md:row-span-2', objectPosition: 'center center' },
  { src: '/images/18.webp', alt: 'Rule The World performance', colSpan: 'md:col-span-1', objectPosition: 'center 70%' },
];

// Backup images in case the above fail to load
const backupGalleryItems = [
  { src: '/images/backup-1.webp', alt: 'Jazz quartet performing on a dimly lit stage', colSpan: 'md:col-span-2' },
  { src: '/images/backup-2.webp', alt: 'Close-up of a saxophone player', rowSpan: 'md:row-span-2' },
  { src: '/images/backup-3.webp', alt: 'The band interacting with the audience', colSpan: 'md:col-span-1' },
  { src: '/images/backup-4.webp', alt: 'Overhead shot of the quartet in action', colSpan: 'md:col-span-2' },
];

const GallerySectionMobile: React.FC = () => { // Renamed component
  const [imageLoadError, setImageLoadError] = useState<{[key: number]: boolean}>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false); // Keep for dot indicators
  const [canScrollRight, setCanScrollRight] = useState(true); // Keep for dot indicators
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // sectionRef is not needed if not using the auto-scroll hook
  // const sectionRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  // isMobile state is not strictly needed inside this component if parent handles switching
  // but keeping it for now for the aria-label and dot indicators logic. 
  // Could be refactored to take an isMobile prop if preferred.
  const [isMobile, setIsMobile] = useState(true); // Default to true, parent will ensure this is only rendered on mobile

  useEffect(() => {
    // This effect is mainly for confirming it *is* mobile, or if the parent component 
    // didn't pass a prop and this component was somehow rendered on desktop.
    const checkMobile = () => {
      const newIsMobile = window.innerWidth <= 768;
      if (!newIsMobile) {
        console.warn("GallerySectionMobile rendered on a non-mobile screen width!");
      }
      setIsMobile(newIsMobile); // Keep internal isMobile for UI elements conditional rendering
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Removed useAutoHorizontalScroll hook call

  const handleImageError = (index: number) => {
    setImageLoadError(prev => ({...prev, [index]: true}));
  };

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeftVal = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const scrollWidthVal = container.scrollWidth;

    const canScrollLeftNow = scrollLeftVal > 10; // Adjusted threshold slightly for mobile
    setCanScrollLeft(canScrollLeftNow);
    
    const maxScrollLeft = scrollWidthVal - containerWidth;
    // Ensure at least a small amount of scroll remaining to be considered "can scroll right"
    const canScrollRightNow = scrollLeftVal < (maxScrollLeft - 10); 
    setCanScrollRight(canScrollRightNow);
  }, []);

  useEffect(() => {
    if (!hasInitialized && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft = 0;
      setHasInitialized(true);
      checkScrollPosition(); // Initial check
    }
  }, [hasInitialized, checkScrollPosition]); // Removed isMobile from deps as it's assumed for this component

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && hasInitialized) {
      const userScrollHandler = () => {
        checkScrollPosition();
      };
      // Listen to scroll for updating dot indicators
      container.addEventListener('scroll', userScrollHandler, { passive: true });
      window.addEventListener('resize', checkScrollPosition); 

      return () => {
        container.removeEventListener('scroll', userScrollHandler);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [hasInitialized, checkScrollPosition]);

  // scrollLeftManual and scrollRightManual are not used for mobile as there are no arrow buttons
  // const scrollLeftManual = () => { ... };
  // const scrollRightManual = () => { ... };

  // Add consistent styling for all logo items
  const isLogo = (src: string, item?: any) => {
    // Check for both the filename convention and the isLogo flag
    return (src.includes('LOGO') || (item && item.isLogo === true));
  };

  // Helper to check if an image should be displayed in full color
  const isFullColor = (item?: any) => {
    return item && item.fullColor === true;
  };

  // New helper to check if we should keep the square/rectangle shape
  const shouldKeepSquare = (item?: any) => {
    return item && item.keepSquare === true;
  };

  // Overlay style helpers
  const getOverlayStyle = (index: number) => {
    const styles = [
      'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/20 after:to-transparent after:z-[1]', // bottom to top gradient
      'after:absolute after:inset-0 after:bg-gradient-to-br after:from-black/15 after:to-black/20 after:z-[1]', // diagonal gradient
      'after:absolute after:inset-0 after:bg-black/10 after:mix-blend-overlay after:z-[1]', // charcoal tint
      'after:absolute after:inset-0 after:bg-gradient-to-r after:from-black/20 after:via-transparent after:to-black/34 after:z-[1]', // side vignette
      'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/25 after:to-black/10 after:mix-blend-multiply after:z-[1]', // dark gradient
      'after:absolute after:inset-0 after:bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.34)_100%)] after:z-[1]', // vignette effect
    ];
    
    return styles[index % styles.length];
  };

  const GalleryContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
      {galleryItems.map((item, index) => {
        // Type assertion to treat item as our defined GalleryItem
        const galleryItem = item as GalleryItem;
        
        return (
          <div 
            key={`slide-${index}`} 
            className={`w-full h-80 md:h-auto overflow-hidden relative rounded-lg shadow-lg group 
                      ${isLogo(galleryItem.src, galleryItem) && !shouldKeepSquare(galleryItem) ? 'bg-brand-midnight-blue p-4' : ''}
                      ${isLogo(galleryItem.src, galleryItem) && shouldKeepSquare(galleryItem) ? 'bg-black p-2 flex items-center justify-center' : 'bg-black/90'}
                      ${galleryItem.colSpan || 'md:col-span-1'} 
                      ${galleryItem.rowSpan || 'md:row-span-1'}
                      ${index === 0 ? 'md:min-h-[300px]' : ''} 
                      ${index === 1 ? 'md:min-h-[620px]' : ''}
                      ${index === 2 ? 'md:min-h-[300px]' : ''}
                      ${!isLogo(galleryItem.src, galleryItem) && !isFullColor(galleryItem) ? getOverlayStyle(index) : ''}
                      `}
          >
            {imageLoadError[index] ? (
              <Image 
                src={backupGalleryItems[index].src}
                alt={backupGalleryItems[index].alt}
                fill={!shouldKeepSquare(galleryItem)}
                width={shouldKeepSquare(galleryItem) ? 500 : undefined}
                height={shouldKeepSquare(galleryItem) ? 500 : undefined}
                style={{ 
                  objectFit: isLogo(galleryItem.src, galleryItem) ? 'contain' : 'cover', 
                  objectPosition: galleryItem.objectPosition || 'center',
                  filter: isLogo(galleryItem.src, galleryItem) || isFullColor(galleryItem) ? 'none' : 'grayscale(100%) contrast(110%)',
                  transform: galleryItem.scale ? `scale(${galleryItem.scale})` : undefined,
                  position: shouldKeepSquare(galleryItem) ? 'relative' : 'absolute'
                }}
                className={`transition-transform duration-500 ease-in-out z-0 ${isLogo(galleryItem.src, galleryItem) ? '' : 'group-hover:scale-110'} ${shouldKeepSquare(galleryItem) ? 'h-full w-full' : ''}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={60}
                loading="lazy"
              />
            ) : (
              <Image 
                src={galleryItem.src}
                alt={galleryItem.alt}
                fill={!shouldKeepSquare(galleryItem)}
                width={shouldKeepSquare(galleryItem) ? 500 : undefined}
                height={shouldKeepSquare(galleryItem) ? 500 : undefined}
                style={{ 
                  objectFit: isLogo(galleryItem.src, galleryItem) ? 'contain' : 'cover',
                  objectPosition: galleryItem.objectPosition || 'center',
                  filter: isLogo(galleryItem.src, galleryItem) || isFullColor(galleryItem) ? 'none' : 'grayscale(100%) contrast(110%)',
                  transform: galleryItem.scale ? `scale(${galleryItem.scale})` : undefined,
                  position: shouldKeepSquare(galleryItem) ? 'relative' : 'absolute'
                }}
                className={`transition-transform duration-500 ease-in-out z-0 ${isLogo(galleryItem.src, galleryItem) ? '' : 'group-hover:scale-110'} ${shouldKeepSquare(galleryItem) ? 'h-full w-full' : ''}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={60}
                loading="lazy"
                onError={() => handleImageError(index)}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const GalleryContent2 = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
      {galleryItems2.map((item, index) => {
        // Type assertion to treat item as our defined GalleryItem
        const galleryItem = item as GalleryItem;
        
        return (
          <div 
            key={`slide2-${index}`} 
            className={`w-full h-80 md:h-auto overflow-hidden relative rounded-lg shadow-lg group 
                      ${isLogo(galleryItem.src, galleryItem) && !shouldKeepSquare(galleryItem) ? 'bg-brand-midnight-blue p-4' : ''}
                      ${isLogo(galleryItem.src, galleryItem) && shouldKeepSquare(galleryItem) ? 'bg-black p-2 flex items-center justify-center' : 'bg-black/90'}
                      ${galleryItem.colSpan || 'md:col-span-1'} 
                      ${galleryItem.rowSpan || 'md:row-span-1'}
                      ${index === 0 ? 'md:min-h-[300px]' : ''} 
                      ${index === 1 ? 'md:min-h-[620px]' : ''}
                      ${index === 2 ? 'md:min-h-[300px]' : ''}
                      ${!isLogo(galleryItem.src, galleryItem) && !isFullColor(galleryItem) ? getOverlayStyle(index + 3) : ''}
                      `}
          >
            <Image 
              src={galleryItem.src}
              alt={galleryItem.alt}
              fill={!shouldKeepSquare(galleryItem)}
              width={shouldKeepSquare(galleryItem) ? 500 : undefined}
              height={shouldKeepSquare(galleryItem) ? 500 : undefined}
              style={{ 
                objectFit: isLogo(galleryItem.src, galleryItem) ? 'contain' : 'cover', 
                objectPosition: galleryItem.objectPosition || 'center',
                filter: isLogo(galleryItem.src, galleryItem) || isFullColor(galleryItem) ? 'none' : 'grayscale(100%) contrast(110%)',
                transform: galleryItem.scale ? `scale(${galleryItem.scale})` : undefined,
                position: shouldKeepSquare(galleryItem) ? 'relative' : 'absolute'
              }}
              className={`transition-transform duration-500 ease-in-out z-0 ${isLogo(galleryItem.src, galleryItem) ? '' : 'group-hover:scale-110'} ${shouldKeepSquare(galleryItem) ? 'h-full w-full' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={60}
              loading="lazy"
              onError={() => console.error(`Error loading image in second gallery: ${galleryItem.src}`)}
            />
          </div>
        );
      })}
    </div>
  );

  const GalleryContent3 = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
      {galleryItems3.map((item, index) => {
        // Type assertion to treat item as our defined GalleryItem
        const galleryItem = item as GalleryItem;
        
        return (
          <div 
            key={`slide3-${index}`} 
            className={`w-full h-80 md:h-auto overflow-hidden relative rounded-lg shadow-lg group 
                      ${isLogo(galleryItem.src, galleryItem) && !shouldKeepSquare(galleryItem) ? 'bg-brand-midnight-blue p-4' : ''}
                      ${isLogo(galleryItem.src, galleryItem) && shouldKeepSquare(galleryItem) ? 'bg-black p-2 flex items-center justify-center' : 'bg-black/90'}
                      ${galleryItem.colSpan || 'md:col-span-1'} 
                      ${galleryItem.rowSpan || 'md:row-span-1'}
                      ${index === 0 ? 'md:min-h-[300px]' : ''} 
                      ${index === 1 ? 'md:min-h-[620px]' : ''}
                      ${index === 2 ? 'md:min-h-[300px]' : ''}
                      ${!isLogo(galleryItem.src, galleryItem) && !isFullColor(galleryItem) ? getOverlayStyle(index + 2) : ''}
                      `}
          >
            <Image 
              src={galleryItem.src}
              alt={galleryItem.alt}
              fill={!shouldKeepSquare(galleryItem)}
              width={shouldKeepSquare(galleryItem) ? 500 : undefined}
              height={shouldKeepSquare(galleryItem) ? 500 : undefined}
              style={{ 
                objectFit: isLogo(galleryItem.src, galleryItem) ? 'contain' : 'cover',
                objectPosition: galleryItem.objectPosition || 'center',
                filter: isLogo(galleryItem.src, galleryItem) || isFullColor(galleryItem) ? 'none' : 'grayscale(100%) contrast(120%)',
                transform: galleryItem.scale ? `scale(${galleryItem.scale})` : undefined,
                position: shouldKeepSquare(galleryItem) ? 'relative' : 'absolute'
              }}
              className={`transition-transform duration-500 ease-in-out z-0 ${isLogo(galleryItem.src, galleryItem) ? '' : 'group-hover:scale-110'} ${shouldKeepSquare(galleryItem) ? 'h-full w-full' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={60}
              loading="lazy"
              onError={() => console.error(`Error loading image in third gallery: ${galleryItem.src}`)}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <SectionWrapper 
      id="gallery-mobile" // Changed ID to avoid conflict
      className="min-h-screen flex flex-col items-center justify-center bg-brand-midnight-blue py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative"
      // No ref={sectionRef} needed here
    >
      <div className="container mx-auto max-w-container text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-champagne mb-4">
          Gallery
        </h2>
        <p className="text-lg text-brand-champagne/70 mb-12 max-w-2xl mx-auto font-sans">
          A glimpse into the moments we create. See the quartet in action and imagine the ambiance we can bring to your event.
        </p>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto hide-scrollbar scroll-snap-x scroll-smooth w-full" 
          tabIndex={0}
          style={{ WebkitOverflowScrolling: 'touch' }} // Essential for smooth swipe on iOS
          aria-label="Gallery slideshow, swipe to navigate" // Updated aria-label for mobile
        >
          <GallerySlide className="scroll-snap-center w-full flex-shrink-0">{GalleryContent()}</GallerySlide>
          <GallerySlide className="scroll-snap-center w-full flex-shrink-0">{GalleryContent2()}</GallerySlide>
          <GallerySlide className="scroll-snap-center w-full flex-shrink-0">{GalleryContent3()}</GallerySlide>
        </div>
        
        {/* Removed Desktop Arrow Controls as this is GallerySectionMobile */}
        
        {/* Mobile Indicator Dots - always visible as this is GallerySectionMobile */}
        {/* The isMobile check here is somewhat redundant if parent ensures this only renders on mobile, but safe to keep */}
        {isMobile && (
          <div className="flex justify-center mt-4 space-x-2">
            {[0, 1, 2].map((dotIndex) => {
              // Logic to determine active dot based on scroll position
              const container = scrollContainerRef.current;
              let isActive = false;
              if (container) {
                const slideWidth = container.scrollWidth / 3; // Assuming 3 slides
                const currentScroll = container.scrollLeft;
                const activeSlideIndex = Math.round(currentScroll / slideWidth);
                isActive = dotIndex === activeSlideIndex;
              }

              return (
                <button
                  key={`dot-${dotIndex}`}
                  onClick={() => {
                    const currentContainer = scrollContainerRef.current;
                    if (currentContainer) {
                      const slideWidth = currentContainer.scrollWidth / 3;
                      currentContainer.scrollTo({
                        left: dotIndex * slideWidth,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    isActive ? 'bg-brand-gold' : 'bg-brand-champagne/30'
                  }`}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default GallerySectionMobile; 