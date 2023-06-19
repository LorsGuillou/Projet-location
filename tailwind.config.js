/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{pug, js}"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    logs: true
  }
}

