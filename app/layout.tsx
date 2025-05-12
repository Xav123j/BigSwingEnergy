import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import React from 'react';
import { AudioManagerProvider } from '@/context/AudioManager';
import Script from 'next/script';
// import { getPublicUrlBase } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });

const siteName = 'Big Swing Energy';
const description = 'Quiet swagger, classics re-spun — pure Big Swing Energy';
// const productionBaseUrl = getPublicUrlBase();

const siteUrl = process.env.NODE_ENV === 'production' ? 'https://bigswingenergy.com' : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: description,
  // manifest: `${productionBaseUrl}/site.webmanifest`,
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: siteName,
    description: description,
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/images/BSE_LOGO_CIRCULAR.webp`,
        width: 1024,
        height: 1024,
        alt: `Big Swing Energy`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: description,
    images: [`${siteUrl}/images/BSE_LOGO_CIRCULAR.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "name": "Big Swing Energy",
  "description": "Manchester jazz quartet performing swing standards and jazz-style pop covers.",
  "genre": "Jazz",
  "url": "https://bigswingenergy.com/",
  "image": "https://bigswingenergy.com/assets/og/bigswingenergy-hero.webp",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Manchester",
    "addressCountry": "GB"
  },
  "sameAs": [
    "https://instagram.com/bigswingenergy"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <head>
        <link rel="preload" as="image" href="/assets/og/bigswingenergy-hero.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-brand-black text-brand-champagne antialiased min-h-screen flex flex-col">
        <AudioManagerProvider>
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AudioManagerProvider>
        
        {/* Cookie consent banner */}
        <Script
          src="/cookie-banner.js"
          strategy="afterInteractive"
          id="cookie-banner-script"
        />
      </body>
    </html>
  );
} 