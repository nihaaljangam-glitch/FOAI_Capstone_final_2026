/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        aetheric: {
          pink: '#e04bf5',
          bg: '#050505',
          panel: '#101010',
          border: '#1f1f1f',
          text: '#f3f4f6',
          muted: '#808080',
          green: '#10b981',
          red: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
