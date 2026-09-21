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
        // Base / Neutrals: "The Forge" Metallurgy Foundations
        // 1. Warm near-black (graphite/charcoal, NOT blue-black) for backgrounds
        obsidian: {
          950: '#0c0c0e', // deep warm graphite canvas base (replaces blue-black)
          900: '#141416', // warm charcoal card surface
          850: '#1a1a1d', // warm deep charcoal panel
          800: '#222226', // warm charcoal interactive surface
          700: '#2e2e33', // warm graphite divider
          600: '#3f3f46', // muted cast iron
        },
        charcoal: {
          950: '#0c0c0e',
          900: '#141416',
          850: '#1a1a1d',
          800: '#222226',
          700: '#2e2e33',
          600: '#3f3f46',
        },

        // 2. Warm off-white / bone for primary text (not pure white)
        white: '#f5f2eb',     // replaces pure white (#ffffff) with warm off-white / bone
        bone: {
          DEFAULT: '#f5f2eb', // warm off-white / bone primary text
          50: '#faf8f5',      // ivory highlight
          100: '#f5f2eb',     // warm bone
          200: '#ede8df',     // soft parchment
          300: '#ded7cc',     // muted bone
          400: '#cec7be',     // antique bone
        },

        // 3. Muted warm grey for secondary text and borders
        warmgrey: {
          50: '#faf8f5',
          100: '#f5f2eb', // warm bone
          200: '#e6e1d8',
          300: '#cec7be', // high-contrast secondary text
          400: '#a39e95', // muted warm grey for secondary text
          500: '#79736a', // muted warm grey for tertiary text / captions
          600: '#58524a', // dark warm grey for unworked outlines
          700: '#3a3632', // warm grey border (prominent / hover)
          800: '#262320', // muted warm grey border (default card border)
          900: '#1a1816', // sunken warm grey surface
          950: '#11100f', // deep warm soot
        },

        // Map Tailwind's default slate scale to muted warm grey & bone
        // so all existing text-slate-* and border-slate-* automatically shed their cold blue tint
        slate: {
          50: '#faf8f5',
          100: '#f5f2eb', // warm off-white / bone (primary text)
          200: '#e6e1d8',
          300: '#cec7be',
          400: '#a39e95', // muted warm grey (secondary text)
          500: '#79736a', // tertiary text
          600: '#58524a',
          700: '#3a3632', // prominent warm grey border
          800: '#262320', // default muted warm grey border
          900: '#1a1816',
          950: '#11100f',
        },

        // "The Forge" — Heated Metal & Furnace Flame Palette
        brand: {
          50: '#fff7ed',  // glowing white heat
          100: '#ffedd5', // incandescent warmth
          200: '#fed7aa', // furnace radiance
          300: '#fdba74', // molten gold
          400: '#fb923c', // glowing forge amber
          500: '#f97316', // blazing forge heat (Primary CTA)
          600: '#ea580c', // deep glowing ember
          700: '#c2410c', // hearth red
          800: '#9a3412', // furnace brick
          900: '#7c2d12', // molten core dark
          950: '#431407', // soot and dark ember base
        },

        // "The Forge" — Tempered Cool Blue-Steel (Finished / Mastered / Quenched)
        steel: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8', // tempered blue-steel sheen
          500: '#0ea5e9', // quenched steel
          600: '#0284c7', // deep tempered steel
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },

        // Semantic algorithm roles:
        algo: {
          active: '#f97316',    // heated / transforming iron (blazing orange)
          compare: '#f59e0b',   // molten crucible gold (amber)
          sorted: '#38bdf8',    // tempered cool blue-steel (finished/quenched)
          visited: '#79736a',   // worked warm graphite marker
          danger: '#ef4444',    // slag / critical heat warning
          neutral: '#58524a',   // raw unworked cast iron
          secondary: '#fb923c', // secondary heat marker
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
          '0%': { boxShadow: '0 0 15px rgba(249, 115, 22, 0.25)' },
          '100%': { boxShadow: '0 0 25px rgba(249, 115, 22, 0.55)' },
        }
      }
    },
  },
  plugins: [],
}
