'use client';

import React, { useState, useRef, useEffect } from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import Image from 'next/image';
import GallerySlide from '@/components/gallery/GallerySlide';
import useAutoHorizontalScroll from '@/hooks/useAutoHorizontalScroll';

// Slide 1: Mix performance with logo
const galleryItems = [
  { src: '/images/1.webp', alt: 'These Are The Days', colSpan: 'md:col-span-2', objectPosition: 'center 50%' },
  { src: '/images/7.webp', alt: 'Rule The World', rowSpan: 'md:row-span-2', objectPosition: '70% center' },
  { src: '/images/15.webp', alt: 'BSE Logo Circular', colSpan: 'md:col-span-1', objectPosition: 'center center' },
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
  { 
    src: '/images/5.webp', 
    alt: 'Love performance', 
    colSpan: 'md:col-span-1', 
    objectPosition: 'center center',
    isLogo: true,
    keepSquare: true,  // Flag to keep square shape
    scale: 0.9  // Scale factor to better fit in the square
  },
];

// Slide 3: Another mix
const galleryItems3 = [
  { src: '/images/15.webp', alt: 'Rocking Christmas Tree performance', colSpan: 'md:col-span-2', objectPosition: 'center center' },
  { src: '/images/10.webp', alt: 'Overhead shot of the quartet in action', rowSpan: 'md:row-span-2', objectPosition: 'center center' },
  { src: '/images/17.webp', alt: 'Rule The World performance', colSpan: 'md:col-span-1', objectPosition: 'center 70%' },
];

// Images that were removed from the slides (to be used elsewhere)
const extraImages = [
  { src: '/images/4.webp', alt: 'Rocking around the Christmas tree', objectPosition: 'center center' },
  { src: '/images/8.webp', alt: 'BSE Logo Horizontal', objectPosition: 'center center' },
  { src: '/images/12.webp', alt: 'Love snapshot', objectPosition: 'center center' },
];

// Backup images in case the above fail to load
const backupGalleryItems = [
  { src: '/images/backup-1.webp', alt: 'Jazz quartet performing on a dimly lit stage', colSpan: 'md:col-span-2' },
  { src: '/images/backup-2.webp', alt: 'Close-up of a saxophone player', rowSpan: 'md:row-span-2' },
  { src: '/images/backup-3.webp', alt: 'The band interacting with the audience', colSpan: 'md:col-span-1' },
  { src: '/images/backup-4.webp', alt: 'Overhead shot of the quartet in action', colSpan: 'md:col-span-2' },
];

// Add consistent styling for all logo items
const isLogo = (src: string, item?: any) => {
  // Check for both the filename convention and the isLogo flag
  return (src.includes('LOGO') || (item && item.isLogo === true));
};

// New helper to check if we should keep the square/rectangle shape
const shouldKeepSquare = (item?: any) => {
  return item && item.keepSquare === true;
};

// Overlay style helpers
const getOverlayStyle = (index: number) => {
  const styles = [
    'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/28 after:to-transparent after:z-[1]', // bottom to top gradient
    'after:absolute after:inset-0 after:bg-gradient-to-br after:from-black/21 after:to-black/28 after:z-[1]', // diagonal gradient
    'after:absolute after:inset-0 after:bg-black/14 after:mix-blend-overlay after:z-[1]', // charcoal tint
    'after:absolute after:inset-0 after:bg-gradient-to-r after:from-black/28 after:via-transparent after:to-black/49 after:z-[1]', // side vignette
    'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/35 after:to-black/14 after:mix-blend-multiply after:z-[1]', // dark gradient
    'after:absolute after:inset-0 after:bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.49)_100%)] after:z-[1]', // vignette effect
  ];
  
  return styles[index % styles.length];
};

// Helper to check if an image should be displayed in full color
const isFullColor = (item?: any) => {
  return item && item.fullColor === true;
};

const GallerySectionDesktop: React.FC = () => {
  const [imageLoadError, setImageLoadError] = useState<{[key: number]: boolean}>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  useAutoHorizontalScroll(scrollContainerRef, {
    speed: 0.75,
    sectionRef: sectionRef,
    pauseDuration: 500, // Resume auto-scrolling 3 seconds after manual interaction stops
    disabled: false // Temporarily disable auto-scrolling
  });

  const handleImageError = (index: number) => {
    console.error(`Error loading image ${index}: ${galleryItems[index].src}`);
    setImageLoadError(prev => ({...prev, [index]: true}));
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => prev + 1);
  };

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeftVal = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const scrollWidthVal = container.scrollWidth;

    const canScrollLeftNow = scrollLeftVal > 20;
    setCanScrollLeft(canScrollLeftNow);
    
    const maxScrollLeft = scrollWidthVal - containerWidth;
    const canScrollRightNow = scrollLeftVal < (maxScrollLeft - 20);
    setCanScrollRight(canScrollRightNow);
  };

  useEffect(() => {
    console.log("GalleryDesktop: Attempting initialization. HasInitialized:", hasInitialized, "ImagesLoaded:", imagesLoaded);
    if (!hasInitialized && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      console.log("GalleryDesktop: Initializing...");
      
      container.scrollLeft = 0;
      
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      console.log("GalleryDesktop: Scroll dimensions:", { scrollWidth, clientWidth, scrollable: scrollWidth > clientWidth });
            
      setHasInitialized(true);
      checkScrollPosition();
    }
  }, [hasInitialized]);

  useEffect(() => {
    if (sectionRef.current) {
      console.log("GalleryDesktop: SectionRef is connected to DOM:", 
        sectionRef.current.id === 'gallery-desktop' ? 'Yes - correctly got #gallery-desktop' : 'No - incorrect element or ID',
        sectionRef.current
      );
    } else {
      console.log("GalleryDesktop: SectionRef is NOT connected to DOM");
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && hasInitialized) { 
      const userScrollHandler = () => {
        checkScrollPosition(); 
      };
      container.addEventListener('scroll', userScrollHandler, { passive: true });
      window.addEventListener('resize', checkScrollPosition); 

      return () => {
        container.removeEventListener('scroll', userScrollHandler);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [hasInitialized]);

  const scrollLeftManual = () => {
    scrollContainerRef.current?.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
  };

  const scrollRightManual = () => {
    scrollContainerRef.current?.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
  };

  const GalleryContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr md:h-[650px]">
      {galleryItems.map((item, index) => (
        <div 
          key={`slide-${index}`} 
          className={`w-full h-80 md:h-full overflow-hidden relative rounded-lg shadow-lg group ${isLogo(item.src, item) ? 'bg-brand-midnight-blue p-4' : 'bg-black/90'}
                    ${item.colSpan || 'md:col-span-1'} 
                    ${item.rowSpan || 'md:row-span-1'}
                    ${index === 0 ? 'md:min-h-[300px]' : ''}
                    ${index === 1 ? 'md:min-h-[620px]' : ''}
                    ${index === 2 ? 'md:min-h-[300px]' : ''}
                    ${!isLogo(item.src, item) ? getOverlayStyle(index) : ''}
                    `}
        >
          {imageLoadError[index] ? (
            <Image 
              src={backupGalleryItems[index].src}
              alt={backupGalleryItems[index].alt}
              fill
              style={{ 
                objectFit: isLogo(item.src, item) ? 'contain' : 'cover', 
                objectPosition: item.objectPosition || 'center',
                filter: isLogo(item.src, item) ? 'none' : 'grayscale(100%) contrast(110%)'
              }}
              className="transform transition-transform duration-500 ease-in-out group-hover:scale-110 z-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={70}
              loading="lazy"
            />
          ) : (
            <Image 
              src={item.src}
              alt={item.alt}
              fill
              style={{ 
                objectFit: isLogo(item.src, item) ? 'contain' : 'cover',
                objectPosition: item.objectPosition || 'center',
                filter: isLogo(item.src, item) ? 'none' : 'grayscale(100%) contrast(110%)'
              }}
              className="transform transition-transform duration-500 ease-in-out group-hover:scale-110 z-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={70}
              onError={() => handleImageError(index)}
              onLoad={() => handleImageLoad(index)}
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  );

  const GalleryContent2 = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr md:h-[650px]">
      {galleryItems2.map((item, index) => (
        <div 
          key={`slide2-${index}`} 
          className={`w-full h-80 md:h-full overflow-hidden relative rounded-lg shadow-lg group 
                    ${isLogo(item.src, item) && !shouldKeepSquare(item) ? 'bg-brand-midnight-blue p-4' : ''}
                    ${isLogo(item.src, item) && shouldKeepSquare(item) ? 'bg-black p-2 flex items-center justify-center' : 'bg-black/90'}
                    ${item.colSpan || 'md:col-span-1'} 
                    ${item.rowSpan || 'md:row-span-1'}
                    ${index === 0 ? 'md:min-h-[300px]' : ''}
                    ${index === 1 ? 'md:min-h-[620px]' : ''}
                    ${index === 2 ? 'md:min-h-[300px]' : ''}
                    ${!isLogo(item.src, item) && !isFullColor(item) ? getOverlayStyle(index + 3) : ''}
                    `}
        >
          <Image 
            src={item.src}
            alt={item.alt}
            fill={!shouldKeepSquare(item)}
            width={shouldKeepSquare(item) ? 500 : undefined}
            height={shouldKeepSquare(item) ? 500 : undefined}
            style={{ 
              objectFit: isLogo(item.src, item) ? 'contain' : 'cover', 
              objectPosition: item.objectPosition || 'center',
              filter: isLogo(item.src, item) || isFullColor(item) ? 'none' : 'grayscale(100%) contrast(110%)',
              transform: item.scale ? `scale(${item.scale})` : undefined,
              position: shouldKeepSquare(item) ? 'relative' : 'absolute'
            }}
            className={`transition-transform duration-500 ease-in-out z-0 ${isLogo(item.src, item) ? '' : 'group-hover:scale-110'} ${shouldKeepSquare(item) ? 'h-full w-full' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={70}
            loading="lazy"
            onError={() => console.error(`Error loading image in second gallery: ${item.src}`)}
          />
        </div>
      ))}
    </div>
  );

  const GalleryContent3 = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr md:h-[650px]">
      {galleryItems3.map((item, index) => (
        <div 
          key={`slide3-${index}`} 
          className={`w-full h-80 md:h-full overflow-hidden relative rounded-lg shadow-lg group 
                    bg-black/90
                    ${item.colSpan || 'md:col-span-1'} 
                    ${item.rowSpan || 'md:row-span-1'}
                    ${index === 0 ? 'md:min-h-[300px]' : ''}
                    ${index === 1 ? 'md:min-h-[620px]' : ''}
                    ${index === 2 ? 'md:min-h-[300px]' : ''}
                    ${getOverlayStyle(index + 2)}
                    `}
        >
          <Image 
            src={item.src}
            alt={item.alt}
            fill
            style={{ 
              objectFit: isLogo(item.src, item) ? 'contain' : 'cover',
              objectPosition: item.objectPosition || 'center',
              filter: isLogo(item.src, item) ? 'none' : 'grayscale(100%) contrast(120%)'
            }}
            className="transform transition-transform duration-500 ease-in-out group-hover:scale-110 z-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={70}
            loading="lazy"
            onError={() => console.error(`Error loading image in third gallery: ${item.src}`)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <SectionWrapper 
      id="gallery-desktop"
      className="min-h-screen flex flex-col items-center justify-center bg-brand-midnight-blue py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative"
      ref={sectionRef}
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
          className="flex overflow-x-auto hide-scrollbar scroll-smooth w-full"
          tabIndex={0}
          aria-label="Gallery slideshow, auto-scrolling enabled, use arrow keys to navigate"
        >
          <GallerySlide className="scroll-snap-center w-full flex-shrink-0"><GalleryContent /></GallerySlide>
          <GallerySlide className="scroll-snap-center w-full flex-shrink-0"><GalleryContent2 /></GallerySlide>
          <GallerySlide className="scroll-snap-center w-full flex-shrink-0"><GalleryContent3 /></GallerySlide>
        </div>
        
        <>
            <div className="absolute top-1/2 left-4 hidden md:block z-10">
              <button 
                onClick={scrollLeftManual}
                className="p-2 rounded-full bg-brand-midnight-blue/70 text-brand-champagne hover:text-brand-gold transition-colors"
                aria-label="Previous gallery slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div className="absolute top-1/2 right-4 hidden md:block z-10">
              <button 
                onClick={scrollRightManual}
                className="p-2 rounded-full bg-brand-midnight-blue/70 text-brand-champagne hover:text-brand-gold transition-colors"
                aria-label="Next gallery slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
        </>
      </div>
    </SectionWrapper>
  );
};

export default GallerySectionDesktop; 