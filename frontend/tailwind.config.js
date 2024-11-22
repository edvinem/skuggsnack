// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E3047',       // Main background color
        accent: '#3BBA9C',        // Main accent color
        darkBlue: '#43455C',
        mediumBlue: '#3C3F58',
        neutral: '#707793',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
