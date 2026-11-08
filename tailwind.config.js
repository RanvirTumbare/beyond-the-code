/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F7F8F7',
          muted: '#F0F2F1',
        },
        primary: {
          DEFAULT: '#202520',
          dark: '#141814',
          light: '#2E352E',
        },
        muted: {
          DEFAULT: '#777F79',
          light: '#9CA39E',
          dark: '#585F5A',
        },
        accent: {
          DEFAULT: 'var(--accent-color, #43866A)',
          hover: '#366E57',
          light: '#EBF3EF',
          lighter: '#F4F8F5',
          border: '#D1DFD8',
        },
        border: {
          DEFAULT: '#E8ECE9',
          subtle: '#EFF2F0',
          strong: '#D5DDD8',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        editorial: '1100px',
        reading: '720px',
      },
      borderRadius: {
        'editorial': '10px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(32, 37, 32, 0.04), 0 1px 2px rgba(32, 37, 32, 0.02)',
        'card': '0 2px 6px rgba(32, 37, 32, 0.04), 0 1px 3px rgba(32, 37, 32, 0.02)',
        'modal': '0 12px 36px rgba(32, 37, 32, 0.10), 0 4px 12px rgba(32, 37, 32, 0.05)',
      },
      transitionDuration: {
        'editorial': '350ms',
      },
    },
  },
  plugins: [],
}
