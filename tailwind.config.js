/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/src/assets/bg-music1.avif')", 
      },
      colors: {
        'primary': '#ff5722', 
        'secondary': '#03a9f4',
        'background-dark': '#121212',
        'text-dark': '#e0e0e0'
      },
    },
  },
  plugins: [],
}

