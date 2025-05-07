import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import React from 'react';
import { AudioManagerProvider } from '@/context/AudioManager';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });

const siteName = 'Big Swing Energy';
const description = 'Book the finest jazz quartet for your elegant events. Experience unforgettable melodies and soulful rhythms.';
const siteUrl = 'https://www.yourjazzquartetsite.com'; // Replace with your actual domain

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: description,
  viewport: 'width=device-width, initial-scale=1',
  manifest: '/site.webmanifest', // Assuming you'll add a webmanifest
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png', // Assuming you'll add these
  },
  openGraph: {
    title: siteName,
    description: description,
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/images/opengraph-image.jpg`, // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: `Logo for ${siteName}`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: description,
    // site: '@yourtwitterhandle', // Optional: add your Twitter handle
    // creator: '@creatorhandle', // Optional: add creator Twitter handle
    images: [`${siteUrl}/images/opengraph-image.jpg`], // Replace with your actual OG image URL
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
  // verification: { // Optional: add verification for Google Search Console, etc.
  //   google: 'your-google-site-verification-code',
  // },
  alternates: {
    canonical: siteUrl,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <body className="bg-brand-black text-brand-champagne antialiased">
        <AudioManagerProvider>
          <NavBar />
          <main>{children}</main>
        </AudioManagerProvider>
      </body>
    </html>
  );
} 