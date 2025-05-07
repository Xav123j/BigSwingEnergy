import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          gold: '#C9A35F',
          'midnight-blue': '#0D1B36',
          champagne: '#E8DCC9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      screens: {
        md: '769px', // Custom breakpoint for nav collapse
      },
      height: {
        'screen-nav': 'calc(100vh - 4rem)', // Assuming nav height is 4rem (h-16)
      },
      minHeight: {
        'screen-nav': 'calc(100vh - 4rem)',
      },
      maxWidth: {
        'container': '1280px', // Added container max-width
      },
      ringColor: {
        'brand-gold-focus': '#C9A35F', // For focus rings, can be adjusted
      },
      ringOffsetWidth: {
        '3': '3px',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 163, 95, 0.7)' },
          '50%': { boxShadow: '0 0 0 3px rgba(201, 163, 95, 0)' },
        },
      },
      animation: {
        pulseGold: 'pulseGold 2s infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Useful for form styling, might be needed for contact form
  ],
};
export default config; 