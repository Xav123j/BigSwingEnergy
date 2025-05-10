import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import React from 'react';
import { AudioManagerProvider } from '@/context/AudioManager';
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
  viewport: 'width=device-width, initial-scale=1',
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
        url: `${siteUrl}/images/BSE_LOGO_CIRCULAR.png`,
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
    images: [`${siteUrl}/images/BSE_LOGO_CIRCULAR.png`],
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