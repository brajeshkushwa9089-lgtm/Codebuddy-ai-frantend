/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jet: '#05070D',
        navy: {
          DEFAULT: '#0B1220',
          card: '#0B1220',
          panel: '#0E172A',
          border: '#1E293B',
          hover: '#162238',
        },
        cerulean: {
          DEFAULT: '#00BFFF',
          light: '#38D1FF',
          dark: '#0095CC',
          glow: 'rgba(0, 191, 255, 0.35)',
        },
        neonRose: {
          DEFAULT: '#FF2DAA',
          light: '#FF5CBF',
          dark: '#D9168C',
          glow: 'rgba(255, 45, 170, 0.35)',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        dark: {
          bg: '#05070D',
          surface: '#0B1220',
          card: '#0B1220',
          border: '#1E293B',
          hover: '#162238',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-cerulean': '0 0 25px -4px rgba(0, 191, 255, 0.35)',
        'glow-rose': '0 0 25px -4px rgba(255, 45, 170, 0.35)',
        'glow-dual': '0 0 35px -5px rgba(0, 191, 255, 0.25), 0 0 35px -5px rgba(255, 45, 170, 0.2)',
        'glow-card': '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(0, 191, 255, 0.15)',
      },
    },
  },
  plugins: [],
}
