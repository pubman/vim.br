/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS custom properties
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'bg-quaternary': 'var(--color-bg-quaternary)',

        'border-primary': 'var(--color-border-primary)',
        'border-secondary': 'var(--color-border-secondary)',
        'border-accent': 'var(--color-border-accent)',

        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-inverse': 'var(--color-text-inverse)',

        // Vim mode colors
        'vim-normal': 'var(--color-vim-normal)',
        'vim-insert': 'var(--color-vim-insert)',
        'vim-visual': 'var(--color-vim-visual)',
        'vim-command': 'var(--color-vim-command)',

        // Status colors
        'status-success': 'var(--color-status-success)',
        'status-error': 'var(--color-status-error)',
        'status-warning': 'var(--color-status-warning)',
        'status-info': 'var(--color-status-info)',

        // Legacy support - map old classes to new system
        dark: {
          900: 'var(--color-bg-primary)',
          800: 'var(--color-bg-secondary)',
          700: 'var(--color-bg-tertiary)',
          600: 'var(--color-border-primary)',
          500: 'var(--color-bg-quaternary)',
          400: 'var(--color-text-tertiary)',
          300: 'var(--color-text-secondary)',
          200: 'var(--color-text-secondary)',
          100: 'var(--color-text-primary)',
        },

        // Legacy vim colors
        vim: {
          normal: 'var(--color-vim-normal)',
          insert: 'var(--color-vim-insert)',
          visual: 'var(--color-vim-visual)',
          command: 'var(--color-vim-command)',
        },

        // Legacy status colors
        correct: {
          500: 'var(--color-status-success)',
          400: 'var(--color-status-success)',
          300: 'var(--color-status-success)',
        },
        incorrect: {
          500: 'var(--color-status-error)',
          400: 'var(--color-status-error)',
          300: 'var(--color-status-error)',
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