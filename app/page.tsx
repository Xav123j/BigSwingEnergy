import { Metadata } from 'next';
import HomeClient from './home-client'; // Import the new client component

// Metadata object remains here, as app/page.tsx is now a Server Component
export const metadata: Metadata = {
  title: "Big Swing Energy | Manchester Jazz Quartet — Live Band for Events", // ≤60 chars
  description: "Book Big Swing Energy, Manchester's smoothest jazz quartet, for weddings, parties and corporate events. Timeless classics served with a twist.", // 120-155 chars
  alternates: {
    canonical: "https://bigswingenergy.com/",
  },
  openGraph: {
    type: "website",
    siteName: "Big Swing Energy",
    title: "Big Swing Energy | Manchester Jazz Quartet",
    description: "Timeless swing classics re-spun. Book the quartet for unforgettable events.",
    url: "https://bigswingenergy.com/",
    images: [
      {
        url: "/assets/og/bigswingenergy-hero.webp",
        width: 1200,
        height: 630,
        alt: "Big Swing Energy quartet performing live on stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Swing Energy | Manchester Jazz Quartet",
    description: "Book Manchester's smoothest pour of jazz for your next event.",
    images: ["/assets/og/bigswingenergy-hero.webp"],
  },
};

// This is now a Server Component
export default function Page() {
  return <HomeClient />;
} 