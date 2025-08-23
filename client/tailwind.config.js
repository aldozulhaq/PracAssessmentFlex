/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'flex-dark-teal': '#2a4b47',
        'flex-beige': '#fcfaf6',
        'flex-light-gray': '#f3f4f6',
        'flex-text': '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}