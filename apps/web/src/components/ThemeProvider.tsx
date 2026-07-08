'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load preference from local storage or default to light
    const savedTheme = localStorage.getItem('aegis-theme') as Theme | null;
    setThemeState(savedTheme || 'light');
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Set transition class temporarily for smooth theme shifting
    root.classList.add('theme-transitioning');
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 300);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      const systemIsDark = mediaQuery.matches;
      const shouldBeDark = theme === 'dark' || (theme === 'system' && systemIsDark);
      
      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setIsDark(shouldBeDark);
    };

    applyTheme();

    // Listen to system changes if set to system
    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }

    return () => clearTimeout(timeout);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('aegis-theme', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
