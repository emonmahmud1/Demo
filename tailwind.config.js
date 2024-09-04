/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'], 
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["inter", "sans-serif"],
      },
      colors: {
        primary: {light:"#E21A70"},
        secondary:{ light:"#FD982F",dark:"#258988"},
        state:{ state1:"#F9D9E8",state2:"#F5E3D0", state3:"#002F49", state4:"#108549"},
        gray:{gray1:"#333333",gray2:"#4F4F4F",gray3:"#828282",gray4:"#BDBDBD"},
        bg:{dark:"#0F3333",white:"#FFFFFF"}
      },
    },
  },
  plugins: [require("daisyui")],
  
};
// primary: {light:"#FF0099"},
//         secondary:{ light:"#1F8685",dark:"#258988"},
//         bg:{dark:"#0F3333"}