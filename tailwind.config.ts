/** @type {import('tailwindcss').Config} */

export default {
  content: ['./public/index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        '3xs': ['0.55rem', '0.7rem'],
        '2xs': ['0.65rem', '0.8rem'],
      },
      colors: {
        gray: {
          0: '#FFFFFF', // (White)
          50: '#F3F3F3', // (N-50)
          90: '#E9E9E9', // (N-55)
          130: '#DEDEDE', // (N-65)
          370: '#A1A1A1', //
          490: '#828282', //
          510: '#7D7D7D', // (N-200)
          620: '#616161', // (N-400)
          780: '#383838', // (D-100)
          840: '#292929', // (D-400)
          870: '#222222', // (N-670)
          880: '#1E1E1E', // (D-800)
          930: '#121212', // (D-900)
        },
        teal: {
          DEFAULT: '#004C4C',
          450: '#61B8AB', // (DG-600)
          500: '#4FB0A1', // (DG-670)
          550: '#489F92', // (DG-500)

          850: '#004C4C', // (G-500)
          890: '#003737', // (G-600)
          920: '#002929', // (G-670)
        },
        yellow: {
          DEFAULT: '#FFD200',
          500: '#FFD200', // (Y-300)
          520: '#F3C000', // (Y-400)
          550: '#E5B400', // (Y-500)
          570: '#D9AA00', // (DY-500)
        },
        blue: {
          70: '#E3F0F7', // (I-50)
          350: '#5AB8F2', // (DI-500)
          660: '#005CDE', // (I-500)
          840: '#1B2C36', // (DI-50)
        },
        green: {
          70: '#E4F5EB', // (S-50)
          570: '#75B12B', // (DS-500)
          750: '#007F42', // (S-500)
          840: '#232E23', // (DS-50)
        },
        red: {
          60: '#FAE8E6', // (A-50)
          300: '#DF9186', // (DA-500)
          350: '#E0796B', // (DA-600)
          400: '#E45F4E', // (DA-700)
          620: '#C21700', // (A-500)
          750: '#B51500', // (A-600)
          770: '#A81400', // (A-700)
          840: '#341D1D', // (DA-50)
        },
      },
      keyframes: {
        pulseTo0: {
          '50%': { opacity: '0.1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        moveBackground: {
          '0%': { 'background-position-x': '0px' },
          '100%': { 'background-position-x': '-100px' },
        },
        moveUp: {
          '0%': { transform: 'translateY(80px)' },
          '100%': { transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        zoomOut: {
          '0%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0.8)',
          },
        },
        popIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(1.1)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        scaleOut: {
          '0%': {
            transform: 'scale(1)',
          },
          '100%': {
            transform: 'scale(0)',
          },
        },
        animateDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-300px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0px)',
          },
        },
        animateUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(300px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0px)',
          },
        },
      },
      animation: {
        // 'fadeIn': 'fadeIn 0.3s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',
        // 'fadeOut': 'fadeOut 0.3s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',
        // 'zoomIn': 'zoomIn 0.2s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',
        // 'zoomOut': 'zoomOut 0.2s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',
        // 'moveUp': 'moveUp 0.3s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',
        // 'scaleIn': 'scaleIn 0.3s forwards cubic-bezier(0.51,0.92,0.24,1.2)',
        // 'scaleOut': 'scaleOut 0.3s forwards cubic-bezier(0.51,0.92,0.24,1.2)',

        // 'slowFadeIn': 'fadeIn 2s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',
        // 'slowFadeOut': 'fadeOut 2s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',
        // 'slowZoomIn': 'zoomIn 2s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',
        // 'slowZoomOut': 'zoomOut 2s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',

        // 'slowMoveUp': 'moveUp 2s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',
        // 'slowPopIn': 'popIn 2s forwards cubic-bezier(0.51, 0.92, 0.24, 1)',

        landingIntroPopIn: 'popIn 2s forwards ease-in-out',
        landingIntroFadeOut: 'fadeOut 2s 2s forwards ease-in-out', // delayed by 2s
        landingSlidesPopIn: 'popIn 2s 3s forwards ease-in-out', // delayed by 3s
        landingEnterPopIn: 'zoomIn 2s 4s forwards ease-in-out', // delayed by 4s
        landingAnimateDown: 'animateDown 1s 3.1s forwards ease-in-out',
        landingAnimateUp: 'animateUp 1s 3.1s forwards ease-in-out',
        delayedFadeOut: 'fadeOut 2s 2s forwards ease-in-out',
        pulseTo0: 'pulseTo0 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
};
