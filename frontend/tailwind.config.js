/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Kallingal premium palette: warm black, logo green and logo blue.
        kteal:  { 50:"#eaf8f0",100:"#d3f0df",300:"#6fd49d",500:"#06a154",600:"#058646",700:"#046537",900:"#06281a" },
        kblue:  { 50:"#f4f1ea",100:"#e7dfd1",300:"#9a907f",500:"#5c564c",600:"#3a3630",700:"#1f1d1a",900:"#070604" },
        kgreen: { 100:"#e8f3fa",300:"#69b7e4",500:"#1e70ad",600:"#185c8f",700:"#113f63" },
        ink: "#070604"
      },
      fontFamily: {
        display: ["var(--font-display)", "'Sora'", "sans-serif"],
        body: ["var(--font-body)", "'Plus Jakarta Sans'", "sans-serif"],
        editorial: ["var(--font-editorial)", "'Linux Libertine'", "Georgia", "serif"],
        chrome: ["var(--font-chrome)", "'Sora'", "sans-serif"]
      }
    }
  },
  plugins: []
};
