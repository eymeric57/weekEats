/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", // This includes the App.js file at the root level
    "./src/components/**/*.{js,jsx,ts,tsx}", // This includes all files in src/components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}