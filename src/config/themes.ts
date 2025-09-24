import { Theme } from '../types/Theme';

// Helper function to convert rgb values to CSS rgb string
const rgb = (r: number, g: number, b: number) => `rgb(${r}, ${g}, ${b})`;

export const themes: Theme[] = [
  // Dark theme with requested rgb(51,51,51) background
  {
    name: 'dark',
    type: 'dark',
    displayName: 'Dark',
    description: 'Classic dark theme with deep grays',
    colors: {
      bg: {
        primary: rgb(51, 51, 51),      // Main background - requested color
        secondary: rgb(68, 68, 68),     // Card/panel background
        tertiary: rgb(85, 85, 85),      // Elevated elements
        quaternary: rgb(102, 102, 102), // Hover states
      },
      border: {
        primary: rgb(85, 85, 85),       // Main borders
        secondary: rgb(68, 68, 68),     // Subtle borders
        accent: rgb(139, 92, 246),      // Focus/active borders (vim purple)
      },
      text: {
        primary: rgb(255, 255, 255),    // Main text
        secondary: rgb(204, 204, 204),  // Secondary text
        tertiary: rgb(153, 153, 153),   // Muted text
        inverse: rgb(51, 51, 51),       // Inverse text (on colored backgrounds)
      },
      vim: {
        normal: rgb(139, 92, 246),      // Purple for normal mode
        insert: rgb(6, 182, 212),       // Cyan for insert mode
        visual: rgb(245, 158, 11),      // Orange for visual mode
        command: rgb(16, 185, 129),     // Green for command mode
      },
      status: {
        success: rgb(34, 197, 94),      // Green for success/correct
        error: rgb(239, 68, 68),        // Red for error/incorrect
        warning: rgb(245, 158, 11),     // Orange for warnings
        info: rgb(59, 130, 246),        // Blue for info
      },
    },
  },

  // Light theme with requested rgb(243,240,240) background
  {
    name: 'light',
    type: 'light',
    displayName: 'Light',
    description: 'Clean light theme with warm grays',
    colors: {
      bg: {
        primary: rgb(243, 240, 240),    // Main background - requested color
        secondary: rgb(255, 255, 255),  // Card/panel background
        tertiary: rgb(248, 248, 248),   // Elevated elements
        quaternary: rgb(240, 240, 240), // Hover states
      },
      border: {
        primary: rgb(219, 219, 219),    // Main borders
        secondary: rgb(229, 229, 229),  // Subtle borders
        accent: rgb(99, 102, 241),      // Focus/active borders (indigo)
      },
      text: {
        primary: rgb(17, 24, 39),       // Main text (gray-900)
        secondary: rgb(75, 85, 99),     // Secondary text (gray-600)
        tertiary: rgb(107, 114, 128),   // Muted text (gray-500)
        inverse: rgb(255, 255, 255),    // Inverse text (on colored backgrounds)
      },
      vim: {
        normal: rgb(99, 102, 241),      // Indigo for normal mode
        insert: rgb(14, 165, 233),      // Sky blue for insert mode
        visual: rgb(217, 119, 6),       // Amber for visual mode
        command: rgb(5, 150, 105),      // Emerald for command mode
      },
      status: {
        success: rgb(5, 150, 105),      // Emerald for success/correct
        error: rgb(220, 38, 38),        // Red for error/incorrect
        warning: rgb(217, 119, 6),      // Amber for warnings
        info: rgb(37, 99, 235),         // Blue for info
      },
    },
  },

  // Tokyo Night theme based on the popular IDE theme
  {
    name: 'tokyo-night',
    type: 'tokyo-night',
    displayName: 'Tokyo Night',
    description: 'Deep blue night theme inspired by Tokyo',
    colors: {
      bg: {
        primary: rgb(26, 27, 38),       // Deep blue background (#1a1b26)
        secondary: rgb(36, 40, 59),     // Panel background (#24283b)
        tertiary: rgb(52, 59, 88),      // Elevated elements (#343b58)
        quaternary: rgb(68, 75, 106),   // Hover states (#444b6a)
      },
      border: {
        primary: rgb(52, 59, 88),       // Main borders (#343b58)
        secondary: rgb(36, 40, 59),     // Subtle borders (#24283b)
        accent: rgb(125, 207, 255),     // Focus/active borders (tokyo blue)
      },
      text: {
        primary: rgb(169, 177, 214),    // Main text (#a9b1d6)
        secondary: rgb(131, 137, 177),  // Secondary text (#8389b1)
        tertiary: rgb(86, 95, 137),     // Muted text (#565f89)
        inverse: rgb(26, 27, 38),       // Inverse text (on colored backgrounds)
      },
      vim: {
        normal: rgb(187, 154, 247),     // Purple for normal mode (#bb9af7)
        insert: rgb(125, 207, 255),     // Blue for insert mode (#7dcfff)
        visual: rgb(255, 158, 100),     // Orange for visual mode (#ff9e64)
        command: rgb(158, 206, 106),    // Green for command mode (#9ece6a)
      },
      status: {
        success: rgb(158, 206, 106),    // Green for success/correct (#9ece6a)
        error: rgb(247, 118, 142),      // Red for error/incorrect (#f7768e)
        warning: rgb(224, 175, 104),    // Yellow for warnings (#e0af68)
        info: rgb(125, 207, 255),       // Blue for info (#7dcfff)
      },
    },
  },
];

// Export individual themes for convenience
export const darkTheme = themes.find(t => t.type === 'dark')!;
export const lightTheme = themes.find(t => t.type === 'light')!;
export const tokyoNightTheme = themes.find(t => t.type === 'tokyo-night')!;