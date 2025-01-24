/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0AB7D4',
        secondary: '#80F4E3',
        background: '#111',
      },
    },
  },
  plugins: [],
}