/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Fraunces"', '"Instrument Serif"', 'serif'],
        editorial: ['"Instrument Serif"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        void: '#040406',
        surface: {
          DEFAULT: '#07080b',
          card: '#0c0d12',
          elevated: '#111218',
          highlight: '#161822',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.15)'
        },
        cyanAccent: {
          DEFAULT: '#00f0ff',
          dim: 'rgba(0, 240, 255, 0.12)',
          glow: 'rgba(0, 240, 255, 0.35)'
        },
        amberAccent: {
          DEFAULT: '#f59e0b',
          dim: 'rgba(245, 158, 11, 0.12)',
          glow: 'rgba(245, 158, 11, 0.35)'
        },
        emeraldAccent: {
          DEFAULT: '#10b981',
          dim: 'rgba(16, 185, 129, 0.12)',
          glow: 'rgba(16, 185, 129, 0.35)'
        }
      }
    },
  },
  plugins: [],
}
