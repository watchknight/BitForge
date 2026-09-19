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
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        obsidian: {
          950: '#06090e',
          900: '#0b0f17',
          850: '#111723',
          800: '#161f30',
          700: '#1f2b42',
          600: '#2b3b59',
        },
        // Semantic algorithm roles:
        algo: {
          compare: '#f59e0b', // amber
          active: '#06b6d4',  // cyan
          sorted: '#10b981',  // emerald
          visited: '#8b5cf6', // violet
          danger: '#f43f5e',  // rose
          neutral: '#64748b', // slate
          secondary: '#38bdf8', // sky
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
