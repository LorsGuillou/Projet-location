/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{pug, js}"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {},
  },
  plugins: [require("daisyui")],
}

