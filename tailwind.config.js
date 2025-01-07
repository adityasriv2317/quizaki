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
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translatey(-100%)'},
          '100%': { transform: 'translateX(0)'},
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: 1},
          '100%': { transform: 'translateY(-100%)', opacity: 0},
        },
      },
      animation: {
        slideIn: 'slideIn 0.2s ease',
        slideOut: 'slideOut 0.2s ease',
      },
      screens: {
        md: '900px',
      },
    },
  },
  plugins: [],
}