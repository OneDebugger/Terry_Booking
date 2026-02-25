/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // KwaTerry Earthy Color Palette
        primary: '#FDB813', // Warm Mustard Yellow
        secondary: '#7BA65D', // Savannah Green
        accent: '#8B5A2B', // Thatch Brown
        'deep-accent': '#A0522D', // Terracotta Red
        background: '#FCF9F2', // Cream off-white
        foreground: '#4B3621', // Deep Thatch Brown
        muted: '#D4C4A8', // Warm muted
        border: '#C9B896', // Warm border
        // Additional earthy tones
        terracotta: '#A0522D',
        'terracotta-dark': '#8B5A2B',
        cream: '#FCF9F2',
        'thatch-brown': '#4B3621',
        'mustard-yellow': '#FDB813',
        'savannah-green': '#7BA65D',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
