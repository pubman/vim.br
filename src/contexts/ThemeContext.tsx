import React, { createContext, useContext, useEffect, useState } from 'react';
import { type ThemeType, type ThemeContextValue, DEFAULT_THEME, THEME_STORAGE_KEY } from '../types/Theme';
import { themes } from '../config/themes';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    // Try to get theme from localStorage, fallback to default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === 'dark' || stored === 'light' || stored === 'tokyo-night')) {
        return stored as ThemeType;
      }
    }
    return DEFAULT_THEME;
  });

  const currentTheme = themes.find(theme => theme.type === themeType) || themes[0];

  // Apply initial theme immediately on first render to prevent flash
  React.useLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const { colors } = currentTheme;

    // Set variables immediately without waiting for next frame
    root.style.setProperty('--color-bg-primary', colors.bg.primary);
    root.style.setProperty('--color-text-primary', colors.text.primary);
    document.body.style.backgroundColor = colors.bg.primary;
    document.body.style.color = colors.text.primary;
  }, []); // Empty dependency to run only once on mount

  const setTheme = (newTheme: ThemeType) => {
    setThemeType(newTheme);
    // Persist theme preference
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  };

  // Apply theme to CSS custom properties with improved reliability
  useEffect(() => {
    // Ensure DOM is ready before manipulating
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const { colors } = currentTheme;

    // Use requestAnimationFrame to ensure DOM is ready for immediate updates
    requestAnimationFrame(() => {
      // Background colors
      root.style.setProperty('--color-bg-primary', colors.bg.primary);
      root.style.setProperty('--color-bg-secondary', colors.bg.secondary);
      root.style.setProperty('--color-bg-tertiary', colors.bg.tertiary);
      root.style.setProperty('--color-bg-quaternary', colors.bg.quaternary);

      // Border colors
      root.style.setProperty('--color-border-primary', colors.border.primary);
      root.style.setProperty('--color-border-secondary', colors.border.secondary);
      root.style.setProperty('--color-border-accent', colors.border.accent);

      // Text colors - critical for immediate visibility
      root.style.setProperty('--color-text-primary', colors.text.primary);
      root.style.setProperty('--color-text-secondary', colors.text.secondary);
      root.style.setProperty('--color-text-tertiary', colors.text.tertiary);
      root.style.setProperty('--color-text-inverse', colors.text.inverse);

      // Vim mode colors
      root.style.setProperty('--color-vim-normal', colors.vim.normal);
      root.style.setProperty('--color-vim-insert', colors.vim.insert);
      root.style.setProperty('--color-vim-visual', colors.vim.visual);
      root.style.setProperty('--color-vim-command', colors.vim.command);

      // Status colors
      root.style.setProperty('--color-status-success', colors.status.success);
      root.style.setProperty('--color-status-error', colors.status.error);
      root.style.setProperty('--color-status-warning', colors.status.warning);
      root.style.setProperty('--color-status-info', colors.status.info);

      // Update body classes and styles for theme-specific styling
      document.body.className = `theme-${themeType}`;
      document.body.style.backgroundColor = colors.bg.primary;
      document.body.style.color = colors.text.primary;
    });

  }, [currentTheme, themeType]);

  // Apply theme preference to system
  useEffect(() => {
    const root = document.documentElement;

    if (themeType === 'light') {
      root.style.colorScheme = 'light';
    } else {
      root.style.colorScheme = 'dark';
    }
  }, [themeType]);

  const value: ThemeContextValue = {
    currentTheme,
    themeType,
    setTheme,
    availableThemes: themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
