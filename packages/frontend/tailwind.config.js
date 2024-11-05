/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      lineHeight: {
        auto: 'auto',
        22: '1.375rem',
      },
      fontWeight: {
        bold: 700,
        medium: 500,
      },
      fontSize: {
        L: '1.5rem',
        M: '1rem',
        R: '0.875rem',
        S: '0.75rem',
      },
      colors: {
        grayscale: {
          'white-alt': 'rgba(255, 255, 255, 0.7)',
          white: '#ffffff',
          50: '#F5F7F9',
          100: '#D2DAE0',
          200: '#879298',
          300: '#6E8091',
          400: '#5F6E76',
          500: '#4B5966',
          black: '#14212B',
        },
        blue: {
          100: '#7890E7',
          500: '#4362D0',
        },
      },
      textColor: ({ theme }) => ({
        strong: theme('colors.grayscale.black'),
        bold: theme('colors.grayscale.500'),
        default: theme('colors.grayscale.400'),
        weak: theme('colors.grayscale.200'),
        white: {
          default: theme('colors.grayscale.white'),
          weak: theme('colors.grayscale.white-alt'),
        },
        point: theme('colors.blue.500'),
      }),
      backgroundColor: ({ theme }) => ({
        surface: {
          default: theme('colors.grayscale.white'),
          alt: theme('colors.grayscale.50'),
          brand: {
            default: theme('colors.blue.500'),
            alt: theme('colors.blue.100'),
          },
        },
      }),
      borderColor: ({ theme }) => ({
        bold: theme('colors.grayscale.300'),
        default: theme('colors.grayscale.100'),
      }),
      borderWidth: {
        default: '1px',
      },
      borderRadius: {
        radiusFull: '999px',
        radius100: '8px',
      },
      boxShadow: {
        popup: '0 4px 2px 0 rgba(20, 33, 43, 0.02), 0 2px 18px 0 rgba(20, 33, 43, 0.08)',
      },
    },
  },
  plugins: [
    function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({
        a: {
          textDecoration: 'none',
          color: 'inherit',
        },
        button: {
          border: '0',
          cursor: 'pointer',
        },
        html: {
          fontFamily: "'Pretendard', sans-serif",
        },
      });
      addComponents({
        '.primary-btn': {
          width: 'maxContent',
          height: '24px',
          borderWidth: theme('borderWidth.default'),
          borderRadius: theme('borderRadius.radiusFull'),
          padding: '0px 6px',
          transitionProperty: 'colors',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2px',
          borderColor: theme('borderColor.default'),
          color: theme('textColor.weak'),
          '&:hover': {
            borderColor: theme('borderColor.bold'),
            color: theme('textColor.bold'),
          },
        },
      });
      const newUtilities = {
        '.display-bold24': {
          fontWeight: theme('fontWeight.bold'),
          fontSize: theme('fontSize.L'),
          lineHeight: theme('lineHeight.auto'),
        },
        '.display-bold16': {
          fontWeight: theme('fontWeight.bold'),
          fontSize: theme('fontSize.M'),
          lineHeight: theme('lineHeight.auto'),
        },
        '.display-bold14': {
          fontWeight: theme('fontWeight.bold'),
          fontSize: theme('fontSize.R'),
          lineHeight: theme('lineHeight.auto'),
        },
        '.display-bold12': {
          fontWeight: theme('fontWeight.bold'),
          fontSize: theme('fontSize.S'),
          lineHeight: theme('lineHeight.auto'),
        },
        '.display-medium16': {
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.M'),
          lineHeight: theme('lineHeight.22'),
        },
        '.display-medium14': {
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.R'),
          lineHeight: theme('lineHeight.22'),
        },
        '.display-medium12': {
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.S'),
          lineHeight: theme('lineHeight.auto'),
        },
        '.selected-bold16': {
          fontWeight: theme('fontWeight.bold'),
          fontSize: theme('fontSize.M'),
          lineHeight: theme('lineHeight.auto'),
          textDecoration: 'underline',
        },
        '.selected-bold14': {
          fontWeight: theme('fontWeight.bold'),
          fontSize: theme('fontSize.R'),
          lineHeight: theme('lineHeight.auto'),
          textDecoration: 'underline',
        },
        '.available-medium16': {
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.M'),
          lineHeight: theme('lineHeight.22'),
        },
        '.available-medium14': {
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.R'),
          lineHeight: theme('lineHeight.22'),
        },
        '.available-medium12': {
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.S'),
          lineHeight: theme('lineHeight.auto'),
        },
        '.hover-medium16': {
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.M'),
          lineHeight: theme('lineHeight.22'),
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '.hover-medium14': {
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.R'),
          lineHeight: theme('lineHeight.22'),
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
