/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        grayscale: {
          white: '#ffffff',
          black: '#000000',
        },
        green: {
          default: '#B4C25D',
        },
        gray: {
          default: '#D1D1D1',
          bold: '#696969',
        },
        orange: { default: '#F2994A' },
      },
      textColor: ({ theme }) => ({
        white: {
          default: theme('colors.grayscale.white'),
        },
        green: {
          default: theme('colors.green.default'),
        },
        orange: {
          default: theme('colors.orange.default'),
        },
        gray: {
          default: theme('colors.gray.default'),
          bold: theme('colors.gray.bold'),
        },
      }),
      borderColor: ({ theme }) => ({
        default: theme('colors.grayscale.black'),
      }),
      boxShadow: {
        popup: '0 4px 2px 0 rgba(20, 33, 43, 0.02), 0 2px 18px 0 rgba(20, 33, 43, 0.08)',
      },
    },
  },
  plugins: [
    function ({ addBase, addComponents, theme }) {
      addBase({
        html: {
          fontFamily: "'Pretendard', sans-serif",
        },
      });
    },
  ],
};
