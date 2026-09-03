/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#131316',
          sidebar: '#18181C',
          card: '#1C1C21',
          border: '#2A2A32',
          primary: '#6334EB',
          primaryHover: '#5229C8',
          text: '#FFFFFF',
          muted: '#A1A1AA',
          success: '#22C55E',
          warning: '#EAB308',
          danger: '#EF4444'
        }
      }
    },
  },
  plugins: [],
}