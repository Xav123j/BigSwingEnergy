'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from './ui/Button';
import logoImage from '@/public/images/BSE LOGO - CIRCULAR .png';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '#BSE', label: 'BSE' },
  { href: '#music', label: 'Videos' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(href.substring(1));
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0.1 }
    );

    navLinks.forEach(link => {
      const element = document.getElementById(link.href.substring(1));
      if (element) {
        sectionRefs.current[link.href.substring(1)] = element;
        observer.observe(element);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      navLinks.forEach(link => {
        const element = sectionRefs.current[link.href.substring(1)];
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20 flex items-center
        ${isScrolled || isOpen ? 'bg-brand-black shadow-lg' : 'bg-transparent'}`}
    >
      <div 
        className={`absolute inset-0 border-b-2 border-brand-gold transition-opacity duration-300 ease-in-out ${isScrolled || isOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          transitionDelay: isScrolled || isOpen ? '50ms' : '0ms' 
        }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full max-w-container relative z-10">
        <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black rounded-sm">
          <div className="h-12 md:h-16 relative">
            <Image 
              src={logoImage} 
              alt="Big Swing Energy Logo" 
              width={250}
              height={250}
              priority
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavLinkClick(e, link.href)}
              className={`font-sans text-sm font-medium uppercase tracking-wider transition-colors duration-200 hover:text-brand-gold relative py-2
                ${activeSection === link.href.substring(1) 
                  ? 'text-brand-gold after:content-["_"] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-brand-gold' 
                  : 'text-brand-champagne/80'
              }`}
            >
              {link.label}
            </a>
          ))}
          <Button 
            variant="secondary" 
            onClick={() => {
              const contactElement = document.getElementById('contact');
              if (contactElement) contactElement.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm px-5 py-2 ml-2"
          >
            Book
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="text-brand-gold p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1 focus-visible:ring-offset-brand-black"
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
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-brand-black shadow-lg p-4 pt-2">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a 
                key={`mobile-${link.label}`}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link.href)}
                className={`block font-sans text-center text-lg py-2 transition-colors duration-200 hover:text-brand-gold
                  ${activeSection === link.href.substring(1) ? 'text-brand-gold font-semibold' : 'text-brand-champagne/90'}
                `}
              >
                {link.label}
              </a>
            ))}
            <Button 
              variant="primary" 
              className="w-full mt-2 text-lg py-3"
              onClick={() => {
                handleNavLinkClick({} as React.MouseEvent<HTMLAnchorElement>, '#contact');
              }}
            >
              Book The Quartet
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar; 