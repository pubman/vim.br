/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark theme colors based on the screenshot
        dark: {
          900: '#0f0f0f', // Darkest background
          800: '#1a1a1a', // Main background
          700: '#2a2a2a', // Card/panel background
          600: '#3a3a3a', // Border/divider
          500: '#4a4a4a', // Subtle elements
          400: '#6a6a6a', // Muted text
          300: '#8a8a8a', // Secondary text
          200: '#aaaaaa', // Primary text
          100: '#cccccc', // Bright text
        },
        // Typing accuracy colors
        correct: {
          500: '#22c55e', // Green for correct typing
          400: '#4ade80',
          300: '#86efac',
        },
        incorrect: {
          500: '#ef4444', // Red for incorrect typing
          400: '#f87171',
          300: '#fca5a5',
        },
        // Vim motion themed colors
        vim: {
          normal: '#8b5cf6', // Purple for normal mode
          insert: '#06b6d4', // Cyan for insert mode
          visual: '#f59e0b', // Orange for visual mode
          command: '#10b981', // Green for command mode
        }
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