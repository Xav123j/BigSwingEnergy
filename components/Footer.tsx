import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black border-t border-brand-gold/30 py-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-container">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-brand-champagne/70">
              &copy; {currentYear} Big Swing Energy. All rights reserved.
            </p>
          </div>
          <div>
            <nav className="flex gap-6">
              <Link 
                href="/privacy.html" 
                className="text-sm text-brand-champagne/70 hover:text-brand-gold transition-colors duration-200"
              >
                Privacy & Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 