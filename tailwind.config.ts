import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: '#D4AF37',
          'gold-light': '#F0D060',
          cream: '#FAF8F5',
          beige: '#F5E6CC',
          champagne: '#F7E7CE',
          dark: '#1A1A1A',
          charcoal: '#2D2D2D',
          ivory: '#FFFFF0',
          blush: '#FFE4E1',
          rose: '#C9A9A6',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-warm': 'linear-gradient(135deg, #FAF8F5 0%, #F5E6CC 50%, #FAF8F5 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
      },
      boxShadow: {
        'luxury': '0 4px 30px rgba(0, 0, 0, 0.08)',
        'luxury-lg': '0 8px 60px rgba(0, 0, 0, 0.12)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.3), 0 0 10px rgba(212, 175, 55, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
