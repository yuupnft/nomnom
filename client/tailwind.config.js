/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nomnom-orange': '#FFD49B',
        'nomnom-pink': '#FF69B4',
        'nomnom-deep-orange': '#FF6B35',
        'nomnom-cream': '#FFF0E8',
        'nomnom-blush': '#FFE4F0',
        'nomnom-brown': '#361A0C',
        'nomnom-red': '#ED3B23',
        'nomnom-yellow': '#FFE066',
        'nomnom-mint': '#B8F0D0',
      },
      fontFamily: {
        gaegu: ['Gaegu', 'cursive'],
        bowlby: ['"Bowlby One"', 'cursive'],
        rubik: ['Rubik', 'sans-serif'],
        itim: ['Itim', 'cursive'],
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.3) rotate(20deg)', opacity: '0.7' },
        },
        boing: {
          '0%': { transform: 'scale(0.85)' },
          '50%': { transform: 'scale(1.08)' },
          '75%': { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        boing: 'boing 0.4s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'spin-slow': 'spin-slow 8s linear infinite',
        marquee: 'marquee 30s linear infinite',
      },
      boxShadow: {
        'kawaii': '4px 4px 0px #361A0C',
        'kawaii-pink': '4px 4px 0px #FF69B4',
        'kawaii-lg': '6px 6px 0px #361A0C',
      },
    },
  },
  plugins: [],
};
