export type ThemeType = 'dark' | 'light' | 'tokyo-night';

export interface ThemeColors {
  // Background colors
  bg: {
    primary: string;     // Main background
    secondary: string;   // Card/panel background
    tertiary: string;    // Elevated elements
    quaternary: string;  // Hover states
  };

  // Border colors
  border: {
    primary: string;     // Main borders
    secondary: string;   // Subtle borders
    accent: string;      // Focus/active borders
  };

  // Text colors
  text: {
    primary: string;     // Main text
    secondary: string;   // Secondary text
    tertiary: string;    // Muted text
    inverse: string;     // Inverse text (on colored backgrounds)
  };

  // Vim mode colors
  vim: {
    normal: string;      // Normal mode
    insert: string;      // Insert mode
    visual: string;      // Visual mode
    command: string;     // Command mode
  };

  // Status colors
  status: {
    success: string;     // Success/correct
    error: string;       // Error/incorrect
    warning: string;     // Warning
    info: string;        // Info
  };
}

export interface Theme {
  name: string;
  type: ThemeType;
  displayName: string;
  description: string;
  colors: ThemeColors;
}

export interface ThemeContextValue {
  currentTheme: Theme;
  themeType: ThemeType;
  setTheme: (theme: ThemeType) => void;
  availableThemes: Theme[];
}

// Theme configuration constants
export const THEME_STORAGE_KEY = 'vimbr-theme-preference';
export const DEFAULT_THEME: ThemeType = 'dark';