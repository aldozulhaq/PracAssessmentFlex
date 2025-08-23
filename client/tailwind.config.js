/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'flex-dark-green': '#334D4C', // Main dark color
        'flex-white': '#FEFDF7',     // Main background (almost white)
        'flex-cream': '#FDF9EA',     // Accent background (slightly more yellow)
        'flex-text-primary': '#333333', // Primary text color
        'flex-text-secondary': '#555555', // Lighter text color
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}