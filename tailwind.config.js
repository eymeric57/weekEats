/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/OnlineScreens/**/*.{js,jsx,ts,tsx}",
    "./src/screens/OfflineScreens/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        kaushan: ['KaushanScript-Regular', 'cursive'], // Ajoutez une valeur de secours
      },
    },
  },
  plugins: [],
}