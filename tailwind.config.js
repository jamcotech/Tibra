/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          50: '#F4F6EE',
          100: '#E7EBD9',
          200: '#D1DBB6',
          300: '#B5C58E',
          400: '#93A863',
          500: '#748C48',
          600: '#5F7339',
          700: '#4B5C2B',
          800: '#384520',
          900: '#252E15',
          950: '#141A0B',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F5F0E6',
          200: '#EAE1CE',
          300: '#DDD1B4',
          400: '#CDBE9A',
          DEFAULT: '#F9F7F2',
          dark: '#EFEBE1',
        },
        gold: {
          light: '#F5E6A3',
          DEFAULT: '#D4AF37', // Classic Apothecary Gold
          dark: '#AA820A',
          amber: '#B87333',
          foil: '#FFF1B0',
          burnished: '#B8860B',
          antique: '#9E7916',
        },
        amberGlass: {
          light: '#C67A26',
          DEFAULT: '#8C4812',
          dark: '#542605',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft-glow': '0 0 50px -10px rgba(116, 140, 72, 0.22)',
        'gold-glow': '0 0 35px -5px rgba(212, 175, 55, 0.25)',
        'luxury': '0 20px 60px -15px rgba(11, 23, 13, 0.12)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
