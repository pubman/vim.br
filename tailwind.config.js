/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS custom properties with fallbacks
        'bg-primary': 'var(--color-bg-primary, rgb(51, 51, 51))',
        'bg-secondary': 'var(--color-bg-secondary, rgb(68, 68, 68))',
        'bg-tertiary': 'var(--color-bg-tertiary, rgb(85, 85, 85))',
        'bg-quaternary': 'var(--color-bg-quaternary, rgb(102, 102, 102))',

        'border-primary': 'var(--color-border-primary, rgb(85, 85, 85))',
        'border-secondary': 'var(--color-border-secondary, rgb(68, 68, 68))',
        'border-accent': 'var(--color-border-accent, rgb(139, 92, 246))',

        'text-primary': 'var(--color-text-primary, rgb(255, 255, 255))',
        'text-secondary': 'var(--color-text-secondary, rgb(104, 204, 204))',
        'text-tertiary': 'var(--color-text-tertiary, rgb(153, 153, 153))',
        'text-inverse': 'var(--color-text-inverse, rgb(51, 51, 51))',

        // Vim mode colors with fallbacks
        'vim-normal': 'var(--color-vim-normal, rgb(139, 92, 246))',
        'vim-insert': 'var(--color-vim-insert, rgb(6, 182, 212))',
        'vim-visual': 'var(--color-vim-visual, rgb(245, 158, 11))',
        'vim-command': 'var(--color-vim-command, rgb(16, 185, 129))',

        // Status colors with fallbacks
        'status-success': 'var(--color-status-success, rgb(34, 197, 94))',
        'status-error': 'var(--color-status-error, rgb(239, 68, 68))',
        'status-warning': 'var(--color-status-warning, rgb(245, 158, 11))',
        'status-info': 'var(--color-status-info, rgb(59, 130, 246))',

        // Legacy support - map old classes to new system with fallbacks
        dark: {
          900: 'var(--color-bg-primary, rgb(51, 51, 51))',
          800: 'var(--color-bg-secondary, rgb(68, 68, 68))',
          700: 'var(--color-bg-tertiary, rgb(85, 85, 85))',
          600: 'var(--color-border-primary, rgb(85, 85, 85))',
          500: 'var(--color-bg-quaternary, rgb(102, 102, 102))',
          400: 'var(--color-text-tertiary, rgb(153, 153, 153))',
          300: 'var(--color-text-secondary, rgb(104, 204, 204))',
          200: 'var(--color-text-secondary, rgb(104, 204, 204))',
          100: 'var(--color-text-primary, rgb(255, 255, 255))',
        },

        // Legacy vim colors with fallbacks
        vim: {
          normal: 'var(--color-vim-normal, rgb(139, 92, 246))',
          insert: 'var(--color-vim-insert, rgb(6, 182, 212))',
          visual: 'var(--color-vim-visual, rgb(245, 158, 11))',
          command: 'var(--color-vim-command, rgb(16, 185, 129))',
        },

        // Legacy status colors with fallbacks
        correct: {
          500: 'var(--color-status-success, rgb(34, 197, 94))',
          400: 'var(--color-status-success, rgb(34, 197, 94))',
          300: 'var(--color-status-success, rgb(34, 197, 94))',
        },
        incorrect: {
          500: 'var(--color-status-error, rgb(239, 68, 68))',
          400: 'var(--color-status-error, rgb(239, 68, 68))',
          300: 'var(--color-status-error, rgb(239, 68, 68))',
        },
      },
      fontFamily: {
        // Monospace fonts for code/typing text
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', 'monospace'],
        // Sans serif for UI elements
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // Custom font sizes for different elements
        'typing': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.025em' }],
        'code': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.025em' }],
        'stat': ['0.875rem', { lineHeight: '1.25rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cursor': 'cursor 1s infinite',
      },
      keyframes: {
        cursor: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}