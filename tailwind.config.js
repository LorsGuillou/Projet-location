/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.pug'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],

  daisyui: {
    styled: true,
    themes: false,
    base: true,
    utils: true,
    logs: true,
    rtm: false
  }
}

