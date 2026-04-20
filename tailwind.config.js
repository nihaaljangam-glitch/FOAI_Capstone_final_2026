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
          pink: '#C44B2B',   // Rust (Replaces Pink)
          bg: '#0D0C0B',     // Ink (Replaces pure black)
          panel: '#151311',  // Lighter Ink (Replaces panel gray)
          border: 'rgba(237,232,223,0.08)', // Surface with low opacity
          text: '#EDE8DF',   // Cream (Replaces white)
          muted: '#B8B2A8',  // Fog (Replaces light gray)
          green: '#10b981',  // Keep for success
          red: '#C44B2B'     // Rust for errors/destructive too
        }
      }
    },
  },
  plugins: [],
}
