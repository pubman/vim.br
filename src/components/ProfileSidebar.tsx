import { config } from "../config";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";

interface ProfileSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProfileSidebar({ isOpen, onToggle }: ProfileSidebarProps) {
  const { currentTheme, availableThemes, setTheme } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const menuItems: Array<{
    icon: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
  }> = [
      { icon: '⚡', label: 'Practice', active: true },
      { icon: '👤', label: 'Profile' },
      { icon: '🎨', label: 'Theme', onClick: () => setShowThemeSelector(!showThemeSelector) },
      { icon: '❓', label: 'Help' },
      { icon: '🏆', label: 'High Scores' },
      { icon: '👥', label: 'Multiplayer' },
      { icon: '⌨️', label: 'Typing Test' },
      { icon: '🎯', label: 'Layouts' },
    ];



  return (
    <>
      {/* Sidebar */}
      <div className={`absolute right-0 top-0 h-full bg-bg-secondary border-r border-border-primary transition-transform duration-300 z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-50`}>
        {/* Profile header */}
        <div className="p-6 border-b border-border-primary">
          <div className="flex flex-col w-full justify-center items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-vim-normal to-vim-insert rounded-full flex flex-col items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h3 className="text-text-primary font-semibold">pubman</h3>
              <p className="text-text-tertiary text-sm">Level 15</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${item.active
                      ? 'bg-vim-normal text-white'
                      : item.label === 'Theme' && showThemeSelector
                        ? 'bg-bg-tertiary text-text-primary'
                        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.label === 'Theme' && (
                    <span className="ml-auto text-xs opacity-70">
                      {showThemeSelector ? '▼' : '▶'}
                    </span>
                  )}
                </button>

                {/* Theme selector dropdown */}
                {item.label === 'Theme' && showThemeSelector && (
                  <div className="mt-2 ml-4 space-y-1">
                    {availableThemes.map((theme) => (
                      <button
                        key={theme.type}
                        onClick={() => {
                          setTheme(theme.type);
                          setShowThemeSelector(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${currentTheme.type === theme.type
                            ? 'bg-vim-normal text-white'
                            : 'text-text-tertiary hover:bg-bg-quaternary hover:text-text-secondary'
                          }`}
                      >
                        {/* Theme preview dot */}
                        <div
                          className="w-3 h-3 rounded-full border border-border-secondary"
                          style={{
                            background: `linear-gradient(45deg, ${theme.colors.bg.primary} 0%, ${theme.colors.vim.normal} 100%)`
                          }}
                        />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{theme.displayName}</div>
                          <div className="text-xs opacity-70">{theme.description}</div>
                        </div>
                        {currentTheme.type === theme.type && (
                          <span className="text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer links */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-text-tertiary space-y-1">
            <p>{config.email}</p>
            <p>Discord • GitHub</p>
            <p>Terms of Service • Privacy Policy</p>
            <p>English</p>
          </div>
        </div>
      </div>
    </>
  );
}
