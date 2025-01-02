/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oxanium: ["Oxanium", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors:{
        mag: 'rgb(199,69,92)',
      }
    },
  },
  plugins: [],
}