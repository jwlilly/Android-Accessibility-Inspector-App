/* eslint-disable global-require */
/* eslint-disable prettier/prettier */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
    './src/renderer/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto"', "sans-serif"],
        mono: ['"Roboto mono"',"mono" ],
        serif: ['"Roboto serif"',"serif" ],
      },
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    base: true,
    themes: [
      {
        'custom-light': {
           'primary' : '#5576FF',
           'primary-focus' : '#74A4FF',
           'primary-content' : '#FFFFFF',

           'secondary' : '#617898',
           'secondary-focus' : '#8BA6CA',
           'secondary-content' : '#010312',

           'accent' : '#22865B',
           'accent-focus' : '#41be88',
           'accent-content' : '#010312',

           'neutral' : '#161827',
           'neutral-focus' : '#4F4D51',
           'neutral-content' : '#eaf0f6',

           'base-100' : '#ffffff',
           'base-200' : '#f7fafd',
           'base-300' : '#eaf0f6',
           'base-content' : '#161827',

           'info' : '#0177D7',
           'success' : '#009485',
           'warning' : '#9F6C1F',
           'error' : '#DE3603',

          '--rounded-box': '1rem',
          '--rounded-btn': '.5rem',
          '--rounded-badge': '1.9rem',

          '--animation-btn': '0',
          '--animation-input': '0',

          '--btn-text-case': 'uppercase',
          '--navbar-padding': '.5rem',
          '--border-btn': '1px',
        },
      },
      {
        'dark': {
           'primary' : '#793ef9',
           'primary-focus' : '#570df8',
           'primary-content' : '#ffffff',

           'secondary' : '#D52B9D',
           'secondary-focus' : '#bd0091',
           'secondary-content' : '#ffffff',

           'accent' : '#008673',
           'accent-focus' : '#2ba69a',
           'accent-content' : '#ffffff',

           'neutral' : '#2a2e37',
           'neutral-focus' : '#16181d',
           'neutral-content' : '#ffffff',

           'base-100' : '#000413',
           'base-200' : '#2a2e37',
           'base-300' : '#16181d',
           'base-content' : '#ebecf0',

           'info' : '#66c7ff',
           'success' : '#87cf3a',
           'warning' : '#e1d460',
           'error' : '#ff6b6b',

          '--rounded-box': '1rem',
          '--rounded-btn': '.5rem',
          '--rounded-badge': '1.9rem',

          '--animation-btn': '.25s',
          '--animation-input': '.2s',

          '--btn-text-case': 'uppercase',
          '--navbar-padding': '.5rem',
          '--border-btn': '1px',
        },
      },
    ],
  },
  darkMode: ['class', '[data-theme="dark"]']
}

