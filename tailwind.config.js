/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#131316',
        surface: '#1C1C21',
        'surface-hover': '#25252B',
        border: '#2A2A32',
        primary: '#FFFFFF',
        secondary: '#E4E4E7',
        muted: '#A1A1AA',
        accent: '#6334EB',
        'accent-hover': '#5229C8',
        success: '#22C55E',
        warning: '#EAB308',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}