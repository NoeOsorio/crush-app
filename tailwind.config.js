/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'loading-gradient': 'loading 3s linear infinite',
        'scale-102': 'scale-102 200ms ease-in-out',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'scale-102': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' }
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
    },
  },
  plugins: [],
} 