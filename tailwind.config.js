/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      maxWidth: {
        '8xl': '88rem',   // 1408px
        '9xl': '96rem',   // 1536px (2xl)
        '10xl': '108rem', // 1728px (3xl)
      },
      colors: {
        // Base / Neutrals: "The Forge" Metallurgy Foundations (Dynamic Theme Tokens)
        obsidian: {
          950: 'rgb(var(--color-obsidian-950) / <alpha-value>)',
          900: 'rgb(var(--color-obsidian-900) / <alpha-value>)',
          850: 'rgb(var(--color-obsidian-850) / <alpha-value>)',
          800: 'rgb(var(--color-obsidian-800) / <alpha-value>)',
          700: 'rgb(var(--color-obsidian-700) / <alpha-value>)',
          600: 'rgb(var(--color-obsidian-600) / <alpha-value>)',
        },
        charcoal: {
          950: 'rgb(var(--color-obsidian-950) / <alpha-value>)',
          900: 'rgb(var(--color-obsidian-900) / <alpha-value>)',
          850: 'rgb(var(--color-obsidian-850) / <alpha-value>)',
          800: 'rgb(var(--color-obsidian-800) / <alpha-value>)',
          700: 'rgb(var(--color-obsidian-700) / <alpha-value>)',
          600: 'rgb(var(--color-obsidian-600) / <alpha-value>)',
        },

        // Primary High-Contrast Text (Bone in Dark, Charcoal in Light)
        white: 'rgb(var(--color-white) / <alpha-value>)',
        bone: {
          DEFAULT: 'rgb(var(--color-bone) / <alpha-value>)',
          50: 'rgb(var(--color-slate-50) / <alpha-value>)',
          100: 'rgb(var(--color-slate-100) / <alpha-value>)',
          200: 'rgb(var(--color-slate-200) / <alpha-value>)',
          300: 'rgb(var(--color-slate-300) / <alpha-value>)',
          400: 'rgb(var(--color-slate-400) / <alpha-value>)',
        },

        // Muted Warm Grey Scale
        warmgrey: {
          50: 'rgb(var(--color-slate-50) / <alpha-value>)',
          100: 'rgb(var(--color-slate-100) / <alpha-value>)',
          200: 'rgb(var(--color-slate-200) / <alpha-value>)',
          300: 'rgb(var(--color-slate-300) / <alpha-value>)',
          400: 'rgb(var(--color-slate-400) / <alpha-value>)',
          500: 'rgb(var(--color-slate-500) / <alpha-value>)',
          600: 'rgb(var(--color-slate-600) / <alpha-value>)',
          700: 'rgb(var(--color-slate-700) / <alpha-value>)',
          800: 'rgb(var(--color-slate-800) / <alpha-value>)',
          850: 'rgb(var(--color-slate-850) / <alpha-value>)',
          900: 'rgb(var(--color-slate-900) / <alpha-value>)',
          950: 'rgb(var(--color-slate-950) / <alpha-value>)',
        },

        // Slate scale mapped to dynamic custom properties
        slate: {
          50: 'rgb(var(--color-slate-50) / <alpha-value>)',
          100: 'rgb(var(--color-slate-100) / <alpha-value>)',
          200: 'rgb(var(--color-slate-200) / <alpha-value>)',
          300: 'rgb(var(--color-slate-300) / <alpha-value>)',
          400: 'rgb(var(--color-slate-400) / <alpha-value>)',
          500: 'rgb(var(--color-slate-500) / <alpha-value>)',
          600: 'rgb(var(--color-slate-600) / <alpha-value>)',
          700: 'rgb(var(--color-slate-700) / <alpha-value>)',
          800: 'rgb(var(--color-slate-800) / <alpha-value>)',
          850: 'rgb(var(--color-slate-850) / <alpha-value>)',
          900: 'rgb(var(--color-slate-900) / <alpha-value>)',
          950: 'rgb(var(--color-slate-950) / <alpha-value>)',
        },

        // "The Forge" — Heated Metal & Furnace Flame Palette
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: 'rgb(var(--color-brand-300) / <alpha-value>)',
          400: 'rgb(var(--color-brand-400) / <alpha-value>)',
          500: 'rgb(var(--color-brand-500) / <alpha-value>)',
          600: 'rgb(var(--color-brand-600) / <alpha-value>)',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: 'rgb(var(--color-brand-950) / <alpha-value>)',
        },

        // "The Forge" — Tempered Cool Blue-Steel
        steel: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: 'rgb(var(--color-steel-300) / <alpha-value>)',
          400: 'rgb(var(--color-steel-400) / <alpha-value>)',
          500: 'rgb(var(--color-steel-500) / <alpha-value>)',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: 'rgb(var(--color-steel-950) / <alpha-value>)',
        },

        // Amber / Crucible Gold Palette
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: 'rgb(var(--color-amber-300) / <alpha-value>)',
          400: 'rgb(var(--color-amber-400) / <alpha-value>)',
          500: 'rgb(var(--color-amber-500) / <alpha-value>)',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },

        // Semantic Accent System: "The Forge" Simulation Engine States
        forge: {
          unforged: {
            DEFAULT: 'var(--forge-unforged-fill)',
            subtle: 'var(--forge-unforged-subtle)',
            border: 'var(--forge-unforged-border)',
            text: 'var(--forge-unforged-text)',
            bright: 'var(--forge-unforged-text-bright)',
          },
          heat: {
            active: 'var(--forge-heat-active)',
            compare: 'var(--forge-heat-compare)',
            text: 'var(--forge-heat-text)',
            glow: 'var(--forge-heat-glow)',
            bg: 'var(--forge-heat-bg)',
          },
          tempered: {
            sheen: 'var(--forge-tempered-sheen)',
            deep: 'var(--forge-tempered-deep)',
            border: 'var(--forge-tempered-border)',
            text: 'var(--forge-tempered-text)',
            muted: 'var(--forge-tempered-muted)',
            bg: 'var(--forge-tempered-bg)',
          },
          overheated: {
            border: 'var(--forge-overheated-border)',
            text: 'var(--forge-overheated-text)',
            bg: 'var(--forge-overheated-bg)',
            dark: 'var(--forge-overheated-dark)',
          }
        },

        // Semantic algorithm roles
        algo: {
          unforged: 'var(--forge-unforged-fill)',
          active: 'var(--forge-heat-active)',
          compare: 'var(--forge-heat-compare)',
          sorted: 'var(--forge-tempered-sheen)',
          visited: 'var(--forge-tempered-deep)',
          danger: 'var(--forge-overheated-border)',
          neutral: 'var(--forge-unforged-fill)',
          secondary: 'var(--forge-heat-active)',
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
