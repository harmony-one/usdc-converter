/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0AB7D4',
          dark: '#098EA8'
        },
        secondary: {
          DEFAULT: '#80F4E3',
          dark: '#66C3B6'
        },
        background: {
          DEFAULT: '#111111',
          light: '#1A1A1A',
          dark: '#0A0A0A'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif']
      }
    }
  },
  plugins: [],
}
