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
        'xs': '375px',
        'sm': '640px',
        'md': '769px', // Custom breakpoint for nav collapse
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
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
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      fontSize: {
        // Add fluid typography
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.3vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 0.7vw, 1.875rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1vw, 2.25rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.9rem + 1.5vw, 3rem)',
        'fluid-5xl': 'clamp(3rem, 2.5rem + 2vw, 4rem)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Useful for form styling, might be needed for contact form
  ],
};
export default config; 