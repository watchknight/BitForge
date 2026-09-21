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
          600: '#585046', // dark warm grey for unworked outlines
          700: '#443a32', // warm cast-iron border (prominent / hover)
          800: '#2c2621', // warm soot-iron border (default card border)
          850: '#201c18', // ultra-subtle warm divider
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
          600: '#585046',
          700: '#443a32', // prominent warm cast-iron border
          800: '#2c2621', // default warm card border
          850: '#201c18',
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

        // Step 2 Semantic Accent System: "The Forge" Simulation Engine States
        forge: {
          // 1. "Unforged" (default / not yet visited): cool muted grey
          unforged: {
            DEFAULT: '#333842', // unworked iron bar / node fill
            subtle: '#1a1c22',  // unvisited card/surface fill
            border: '#3d434f',  // unworked outline
            text: '#94a3b8',    // cool muted grey text (7.62:1 AAA against base)
            bright: '#cbd5e1',  // light cool iron label (13.16:1 AAA against base)
          },
          // 2. "In the forge" (active / comparing / processing): glowing amber/orange (most vivid)
          heat: {
            active: '#f97316',    // blazing forge heat (single most vivid color, 6.97:1 AA)
            compare: '#f59e0b',   // molten crucible gold (9.10:1 AAA)
            text: '#ffedd5',      // incandescent heat text (17.05:1 AAA)
            glow: 'rgba(249, 115, 22, 0.45)',
            bg: 'rgba(249, 115, 22, 0.16)',
          },
          // 3. "Tempered" (done / confirmed / sorted): cooled blue-steel (distinct from grey)
          tempered: {
            sheen: '#38bdf8',     // cooled blue-steel oxide sheen (9.12:1 AAA)
            deep: '#0284c7',      // deep quenched steel
            border: '#0ea5e9',    // quenched border
            text: '#bae6fd',      // soft silver-ice text (14.73:1 AAA)
            muted: '#7dd3fc',     // cool blue-steel secondary text
            bg: 'rgba(56, 189, 248, 0.14)',
          },
          // 4. Mistake / error state (Overheated metal): deep, slightly desaturated red
          overheated: {
            border: '#c53030',    // deep desaturated red outline
            text: '#fca5a5',      // overheated warning text (10.30:1 AAA)
            bg: 'rgba(185, 28, 28, 0.18)', // overheated tint
            dark: '#241010',
          }
        },

        // Semantic algorithm roles:
        algo: {
          unforged: '#333842',  // cool muted raw iron
          active: '#f97316',    // "In the forge" — blazing orange
          compare: '#f59e0b',   // "In the forge" — molten crucible gold
          sorted: '#38bdf8',    // "Tempered" — cooled blue-steel
          visited: '#38bdf8',   // "Tempered" — visited marker
          danger: '#c53030',    // "Overheated" — mistake/error state
          neutral: '#333842',   // "Unforged" — default raw iron
          secondary: '#fb923c', // "In the forge" — secondary heat marker
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(14, 11, 9, 0.45), 0 0 1px rgba(249, 115, 22, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(14, 11, 9, 0.55), 0 1px 2px -1px rgba(14, 11, 9, 0.55)',
        'md': '0 4px 6px -1px rgba(12, 9, 7, 0.65), 0 2px 4px -2px rgba(12, 9, 7, 0.65), 0 0 16px -2px rgba(249, 115, 22, 0.04)',
        'lg': '0 10px 15px -3px rgba(10, 8, 6, 0.8), 0 4px 6px -4px rgba(10, 8, 6, 0.8), 0 0 24px -4px rgba(249, 115, 22, 0.05)',
        'xl': '0 20px 25px -5px rgba(8, 6, 5, 0.85), 0 8px 10px -6px rgba(8, 6, 5, 0.85), 0 0 32px -4px rgba(249, 115, 22, 0.06)',
        '2xl': '0 25px 50px -12px rgba(6, 5, 4, 0.95), 0 0 45px -5px rgba(249, 115, 22, 0.08)',
        'inner-warm': 'inset 0 1px 0 0 rgba(255, 237, 213, 0.06)',
        'forge-card': '0 10px 25px -5px rgba(10, 8, 6, 0.8), 0 0 1px 1px rgba(249, 115, 22, 0.08)',
        'forge-glow': '0 0 25px rgba(249, 115, 22, 0.35)',
        'steel-glow': '0 0 25px rgba(56, 189, 248, 0.25)',
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
