/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E3047',          // Main background color
        'primary-dark': '#1C1F36',   // Darker shade for primary
        accent: '#3BBA9C',           // Main accent color
        'accent-dark': '#2A9A7A',    // Darker shade for accent
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
