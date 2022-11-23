module.exports = {
  important: '#app',
  content: [
    './public/index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {

    extend: {
      colors: {
        blue: {
          600: '#3470D0',
          DEFAULT: '#3470D0'
        },
        yellow: {
          DEFAULT: '#FFBB01'
        },
        gray: {
          1000: '#666666'
        },
        red: {
          DEFAULT: 'rgba(204, 0, 0, 1)'
        }
      },
      zIndex: {
        '-1': '-1'
      },
      flexGrow: {
        5: '5'
      },
      maxHeight: {
        'screen-menu': 'calc(100vh - 3.5rem)',
        modal: 'calc(100vh - 160px)'
      },
      minHeight: {
        'screen-menu': 'calc(100vh - 3.5rem)',
        modal: 'calc(100vh - 80px)'
      },
      transitionProperty: {
        position: 'right, left, top, bottom, margin, padding',
        textColor: 'color'
      },
      keyframes: {
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 }
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      },
      animation: {
        fadeOut: 'fadeOut 250ms ease-in-out',
        fadeIn: 'fadeIn 250ms ease-in-out'
      }

    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
