/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00AFF0',
          dark: '#0099D6',
          light: '#33BFEF',
        },
        dark: {
          bg: '#000000',
          card: '#0F0F0F',
          border: '#1A1A1A',
          hover: '#1F1F1F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      aspectRatio: {
        '9/16': '9 / 16',
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
}
