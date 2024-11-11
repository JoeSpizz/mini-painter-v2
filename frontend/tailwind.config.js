// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this matches your project structure
  ],
  theme: {
    extend: {
      height: {
        '128': '32rem', // 512px
        '160': '40rem', // 640px
      },
    },
  },
  plugins: [],
};
