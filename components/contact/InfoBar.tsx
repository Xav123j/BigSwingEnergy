'use client';

import React from 'react';
import Link from 'next/link';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

const InfoBar: React.FC = () => {
  const contactInfo: ContactInfo[] = [
    {
      icon: <EnvelopeIcon className="h-5 w-5 text-brand-gold" />,
      label: 'Email',
      value: 'bookings@bigswing.co.uk',
      href: 'mailto:bookings@bigswingenergy.co.uk',
    },
    {
      icon: <MapPinIcon className="h-5 w-5 text-brand-gold" />,
      label: 'Based in',
      value: 'Manchester, UK',
    },
  ];

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/bigswingenergyjazz' },
    { name: 'YouTube', url: 'https://youtube.com/' },
  ];

  return (
    <div className="bg-black rounded-lg p-5 md:p-6 border border-brand-gold/30 shadow-lg h-full flex flex-col max-w-xs mx-auto lg:mx-0">
      <h3 className="text-xl font-serif text-brand-gold mb-6">Contact Info</h3>
      
      <div className="space-y-6 flex-grow">
        {contactInfo.map((info, index) => (
          <div key={index} className="flex items-center">
            <div className="bg-brand-gold/10 p-2.5 rounded-full mr-3">
              {info.icon}
            </div>
            <div>
              <p className="text-xs text-brand-champagne/70 uppercase tracking-wider mb-1 font-sans">{info.label}</p>
              {info.href ? (
                <Link 
                  href={info.href}
                  className="text-brand-champagne hover:text-brand-gold transition-colors duration-200 font-sans"
                >
                  {info.value}
                </Link>
              ) : (
                <p className="text-brand-champagne font-sans">{info.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-brand-gold/20">
        <p className="text-brand-champagne/70 text-xs font-sans">
          Available for events across the UK and internationally
        </p>
      </div>
    </div>
  );
};

export default InfoBar; 