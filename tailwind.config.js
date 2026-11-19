/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071a2b',
          900: '#102a43',
          800: '#173f5f',
          700: '#24557a',
        },
        amber: {
          50: '#fff8ed',
          100: '#ffeed6',
          400: '#f6a95f',
          500: '#ed8b2c',
          600: '#d96f12',
        },
        sand: '#f8f6f1',
      },
      boxShadow: {
        soft: '0 16px 45px rgba(16, 42, 67, 0.10)',
        card: '0 8px 24px rgba(16, 42, 67, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
