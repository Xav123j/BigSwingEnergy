'use client';

import React, { useState, useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from './ui/Button';
import logoImage from '@/public/images/BSE_LOGO_CIRCULAR.webp';
import { Transition } from '@headlessui/react';

interface NavLinkData {
  id: string;
  label: string;
}

// Define base links without href, as href will be dynamic for gallery
const baseNavLinks: NavLinkData[] = [
  { id: 'BSE', label: 'BSE' }, // This should target the StorySection with id="BSE"
  { id: 'music', label: 'Videos' },
  { id: 'gallery', label: 'Gallery' }, // Special handling for this ID
  { id: 'contact', label: 'Contact' },
];

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dynamically generate navLinks based on isMobile state for gallery href
  const navLinks = baseNavLinks.map(link => ({
    ...link,
    href: link.id === 'gallery' ? (isMobile ? '#gallery-mobile' : '#gallery-desktop') : `#${link.id}`,
  }));

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement> | null, href: string) => {
    // Conditionally call preventDefault only if a real event object is passed
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (isOpen) setIsOpen(false);

    setTimeout(() => {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navbarHeight = isMobile ? 64 : 80; // h-16 (64px) or h-20 (80px)
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        // Scroll so the top of the element is precisely under the navbar
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        // Manually set active section on click for immediate feedback
        // The scroll handler will also update it, but this makes UI feel snappier.
        setActiveSection(targetId);
      } else {
        console.warn(`Element with ID '${targetId}' not found for nav click.`);
      }
    }, isMobile ? 10 : 0); // Small delay for mobile menu to close
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const navbarHeight = isMobile ? 64 : 80;
      // This is the viewport Y coordinate that corresponds to the bottom edge of the fixed navbar.
      const scrollThreshold = window.pageYOffset + navbarHeight;

      let newActiveSection = '';

      // If near the top of the page, default to BSE section if it exists
      if (window.pageYOffset < navbarHeight + 50) { // 50px buffer
        const bseLink = navLinks.find(l => l.id === 'BSE');
        if (bseLink) {
          newActiveSection = bseLink.id;
        }
      }
      
      // Find the last section whose top is at or above the scrollThreshold
      // This means this section is currently at the top of the viewport under the navbar.
      for (const link of navLinks) {
        const targetId = link.href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          if (element.offsetTop <= scrollThreshold) {
            newActiveSection = targetId;
          } else {
            // If this section is below the threshold, subsequent sections will also be.
            // So, we can break early if newActiveSection has already been set by a previous (higher up) section.
            if (newActiveSection !== '') break; 
          }
        }
      }
      setActiveSection(newActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on mount and when dependencies change

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, navLinks]); // navLinks changes with isMobile

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20 flex items-center
          ${isScrolled || isOpen ? 'bg-brand-black shadow-lg' : 'bg-transparent'}`}
      >
        <div 
          className={`absolute inset-0 border-b-2 border-brand-gold transition-opacity duration-300 ease-in-out ${isScrolled || isOpen ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: isScrolled || isOpen ? '50ms' : '0ms' }}
        ></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full max-w-container relative z-10">
          <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black rounded-sm">
            <div className="h-10 sm:h-12 md:h-16 relative">
              <Image 
                src={logoImage} 
                alt="Big Swing Energy Logo" 
                width={250} height={250} priority
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link.href)}
                className={`font-sans text-sm font-medium uppercase tracking-wider transition-colors duration-200 hover:text-brand-gold relative py-2
                  ${
                    activeSection === link.href.substring(1)
                      ? 'text-brand-gold' // Active link: no underline, just gold text
                      : 'text-brand-champagne/80'
                  }`}
              >
                {link.label}
              </a>
            ))}
            <Button 
              variant="secondary" 
              onClick={() => handleNavLinkClick(null, '#contact')}
              className="text-sm px-5 py-2 ml-2"
            >
              Book
            </Button>
          </div>

          {/* Mobile Menu Button - unchanged */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className="text-brand-gold p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1 focus-visible:ring-offset-brand-black touch-target"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {/* Uses dynamic navLinks now */} 
        {isMobile ? (
          isOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-brand-black shadow-lg p-4 pt-2 border-t border-brand-gold/30 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a 
                    key={`mobile-${link.id}`}
                    href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                    className={`block font-sans text-center text-lg py-3 transition-colors duration-200 hover:text-brand-gold touch-target
                      ${activeSection === link.href.substring(1) ? 'text-brand-gold font-semibold' : 'text-brand-champagne/90'}
                    `}
                  >
                    {link.label}
                  </a>
                ))}
                <Button 
                  variant="primary" 
                  className="w-full mt-2 text-lg py-3 touch-target"
                  onClick={() => handleNavLinkClick(null, '#contact')}
                >
                  Book The Quartet
                </Button>
              </div>
            </div>
          )
        ) : (
          // Desktop transition wrapped menu - also uses dynamic navLinks
          <Transition
            show={isOpen}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div className="md:hidden absolute top-16 left-0 right-0 bg-brand-black shadow-lg p-4 pt-2 border-t border-brand-gold/30 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a 
                    key={`mobile-transition-${link.id}`}
                    href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                    className={`block font-sans text-center text-lg py-3 transition-colors duration-200 hover:text-brand-gold touch-target
                      ${activeSection === link.href.substring(1) ? 'text-brand-gold font-semibold' : 'text-brand-champagne/90'}
                    `}
                  >
                    {link.label}
                  </a>
                ))}
                <Button 
                  variant="primary" 
                  className="w-full mt-2 text-lg py-3 touch-target"
                  onClick={() => handleNavLinkClick(null, '#contact')}
                >
                  Book The Quartet
                </Button>
              </div>
            </div>
          </Transition>
        )}
      </nav>
      
      {/* Mobile CTA - unchanged */}
      <div className="fixed bottom-0 left-0 w-full py-3 bg-black border-t border-brand-gold/30 z-40 md:hidden">
        <div className="container mx-auto px-4">
          <Button
            variant="primary"
            onClick={() => handleNavLinkClick(null, '#contact')}
            className="w-full py-3 text-base font-medium touch-target"
          >
            Book The Quartet
          </Button>
        </div>
      </div>
    </>
  );
};

export default NavBar; 