/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        beige: {
          50: '#fcfaf8',
          100: '#f8f4f0',
          200: '#f2e9df',
          300: '#e8d7c3',
          400: '#dcc2a6',
          500: '#cead8a',
          600: '#ba9771',
          700: '#a68263',
          800: '#8c6c53',
          900: '#735848',
        },
        brown: {
          50: '#f7f3f0',
          100: '#efe7e0',
          200: '#ded0c3',
          300: '#c8b3a0',
          400: '#b29078',
          500: '#9f7759',
          600: '#8d644a',
          700: '#76513f',
          800: '#634438',
          900: '#523a31',
        },
        accent: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
      },
      animation: {
        fade: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};