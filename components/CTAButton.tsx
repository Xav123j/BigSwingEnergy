'use client';

import React from 'react';
import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
}

// Utility function for combining class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const CTAButton: React.FC<CTAButtonProps> = ({ 
  href, 
  className = '', 
  children, 
  variant = 'primary',
  onClick
}) => {
  const variantClasses = {
    primary: 'bg-brand-gold hover:bg-brand-gold/90 text-black',
    secondary: 'bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold/10',
    outline: 'bg-transparent border border-brand-champagne/20 text-brand-champagne hover:border-brand-champagne/50 hover:bg-white/5',
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-black min-h-[44px] px-4 py-2 sm:py-2 md:py-3 touch-target';

  return (
    <Link 
      href={href}
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </Link>
  );
};

export default CTAButton; 