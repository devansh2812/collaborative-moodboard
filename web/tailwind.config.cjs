/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b11',
        card: '#11111a',
        accent: '#7c3aed',
        accent2: '#22d3ee'
      },
      boxShadow: {
        glow: '0 0 40px rgba(124, 58, 237, 0.35)'
      }
    }
  },
  plugins: []
};

