const { themePreset } = require('./app.config.js')
const defaultColors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    // preflight: false,
  },
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1em',
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1224px',
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        ...themePreset,
        'light-bg': defaultColors.gray[50],
        'dark-bg': defaultColors.gray[800],
        'light-border': defaultColors.gray[200],
        'dark-border': defaultColors.gray[700],
        'light-text': defaultColors.gray[700],
        'dark-text': defaultColors.gray[100]
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
}
