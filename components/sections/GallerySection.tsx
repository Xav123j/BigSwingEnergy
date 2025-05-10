// 'use client';

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import SectionWrapper from '@/components/SectionWrapper';
// import Image from 'next/image';
// import GallerySlide from '@/components/gallery/GallerySlide';
// import useAutoHorizontalScroll from '@/hooks/useAutoHorizontalScroll';

// // Updated galleryItems to use the correct paths for available images
// const galleryItems = [
//   { src: '/gallery/gallery-12.jpg', alt: 'Jazz quartet performing on a dimly lit stage', colSpan: 'md:col-span-2' },
//   { src: '/gallery/gallery-2.jpg', alt: 'Close-up of a saxophone player', rowSpan: 'md:row-span-2' },
//   { src: '/gallery/gallery-3.jpg', alt: 'The band interacting with the audience', colSpan: 'md:col-span-1' },
//   { src: '/gallery/gallery-4.jpg', alt: 'Overhead shot of the quartet in action', colSpan: 'md:col-span-2' },
// ];

// const GallerySection: React.FC = () => {
//   const [imageLoadError, setImageLoadError] = useState<{[key: number]: boolean}>({});
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const [hasInitialized, setHasInitialized] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Log when component renders
//   useEffect(() => {
//     console.log('GallerySection rendered. isMobile:', isMobile);
//   });
  
//   // Check if device is mobile - only run once on mount and on window resize
//   useEffect(() => {
//     const checkMobile = () => {
//       const newIsMobile = window.innerWidth <= 768;
//       setIsMobile(newIsMobile);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Apply the auto-scroll hook
//   useAutoHorizontalScroll(scrollContainerRef, {
//     speed: 0.75,
//     sectionRef: sectionRef,
//     disabled: isMobile,
//   });

//   const handleImageError = (index: number) => {
//     setImageLoadError(prev => ({...prev, [index]: true}));
//   };

//   const checkScrollPosition = useCallback(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const scrollLeftVal = container.scrollLeft;
//     const containerWidth = container.clientWidth;
//     const scrollWidthVal = container.scrollWidth;

//     const canScrollLeftNow = scrollLeftVal > 20;
//     setCanScrollLeft(canScrollLeftNow);
    
//     const maxScrollLeft = scrollWidthVal - containerWidth;
//     const canScrollRightNow = scrollLeftVal < (maxScrollLeft - 20);
//     setCanScrollRight(canScrollRightNow);
//   }, []);

//   // Initialize scrolling setup - This runs ONCE when component is ready
//   useEffect(() => {
//     if (!hasInitialized && scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
      
//       // Reset scroll position
//       container.scrollLeft = 0;
      
//       setHasInitialized(true);
//       checkScrollPosition();
//     }
//   }, [hasInitialized, checkScrollPosition, isMobile]);

//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (container && hasInitialized) {
//       const userScrollHandler = () => {
//         checkScrollPosition();
//       };
//       container.addEventListener('scroll', userScrollHandler, { passive: true });
//       window.addEventListener('resize', checkScrollPosition);

//       return () => {
//         container.removeEventListener('scroll', userScrollHandler);
//         window.removeEventListener('resize', checkScrollPosition);
//       };
//     }
//   }, [hasInitialized, checkScrollPosition]);

//   const scrollLeftManual = () => {
//     scrollContainerRef.current?.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
//   };

//   const scrollRightManual = () => {
//     scrollContainerRef.current?.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
//   };

//   // Gallery slide content (reused for different slides)
//   const GalleryContent = () => (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
//       {galleryItems.map((item, index) => (
//         <div 
//           key={`slide-${index}`} 
//           className={`w-full h-64 md:h-auto overflow-hidden relative rounded-lg shadow-lg group bg-brand-black/20
//                     ${item.colSpan || 'md:col-span-1'} 
//                     ${item.rowSpan || 'md:row-span-1'}
//                     ${index === 0 ? 'md:min-h-[250px]' : ''}
//                     ${index === 1 ? 'md:min-h-[516px]' : ''}
//                     ${index === 2 ? 'md:min-h-[250px]' : ''}
//                     ${index === 3 ? 'md:min-h-[300px]' : ''}
//                     `}
//         >
//           {imageLoadError[index] ? (
//             <div className="w-full h-full flex items-center justify-center text-brand-champagne">
//               {index === 1 && "Error loading saxophone player image"}
//               {index !== 1 && `Error loading ${item.alt}`}
//             </div>
//           ) : (
//             <Image 
//               src={item.src}
//               alt={item.alt}
//               fill
//               style={{ objectFit: 'cover' }}
//               className="transform transition-transform duration-500 ease-in-out group-hover:scale-110"
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//               quality={isMobile ? 60 : 85} // Lower quality on mobile
//               priority={true} // Set all to priority to ensure they load
//               onError={() => handleImageError(index)}
//               loading="eager" // Always eager load for faster rendering
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <SectionWrapper 
//       id="gallery"
//       className="min-h-screen flex flex-col items-center justify-center bg-brand-midnight-blue py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative"
//       ref={sectionRef}
//     >
//       <div className="container mx-auto max-w-container text-center">
//         <h2 className="text-4xl md:text-5xl font-serif text-brand-champagne mb-4">
//           Gallery
//         </h2>
//         <p className="text-lg text-brand-champagne/70 mb-12 max-w-2xl mx-auto font-sans">
//           A glimpse into the moments we create. See the quartet in action and imagine the ambiance we can bring to your event.
//         </p>
        
//         <div 
//           ref={scrollContainerRef}
//           className="flex overflow-x-auto hide-scrollbar scroll-snap-x scroll-smooth w-full" 
//           tabIndex={0}
//           style={{ WebkitOverflowScrolling: 'touch' }}
//           aria-label={isMobile ? "Gallery slideshow, swipe to navigate" : "Gallery slideshow with auto-scroll"}
//         >
//           {/* Gallery slides */}
//           <GallerySlide className="scroll-snap-center w-full">{GalleryContent()}</GallerySlide>
//           <GallerySlide className="scroll-snap-center w-full">{GalleryContent()}</GallerySlide>
//           <GallerySlide className="scroll-snap-center w-full">{GalleryContent()}</GallerySlide>
//         </div>
        
//         {!isMobile && (
//           <>
//             <div className="absolute top-1/2 left-4 hidden md:block z-10">
//               <button 
//                 onClick={scrollLeftManual}
//                 className="p-2 rounded-full bg-brand-midnight-blue/70 text-brand-champagne hover:text-brand-gold transition-colors"
//                 aria-label="Previous gallery slide"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="absolute top-1/2 right-4 hidden md:block z-10">
//               <button 
//                 onClick={scrollRightManual}
//                 className="p-2 rounded-full bg-brand-midnight-blue/70 text-brand-champagne hover:text-brand-gold transition-colors"
//                 aria-label="Next gallery slide"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </>
//         )}
        
//         {/* Mobile Indicator Dots */}
//         {isMobile && (
//           <div className="flex justify-center mt-4 space-x-2">
//             {[0, 1, 2].map((index) => (
//               <button
//                 key={`dot-${index}`}
//                 onClick={() => {
//                   const container = scrollContainerRef.current;
//                   if (container) {
//                     const slideWidth = container.scrollWidth / 3;
//                     container.scrollTo({
//                       left: index * slideWidth,
//                       behavior: 'smooth'
//                     });
//                   }
//                 }}
//                 className={`w-2 h-2 rounded-full ${
//                   (canScrollRight && !canScrollLeft && index === 0) || 
//                   (!canScrollRight && canScrollLeft && index === 2) || 
//                   (!canScrollRight && !canScrollLeft && index === 1) 
//                     ? 'bg-brand-gold' : 'bg-brand-champagne/30'
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </SectionWrapper>
//   );
// };

// export default GallerySection; 