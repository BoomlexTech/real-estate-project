'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark';

// Agent/Admin portal palette — used in inline styles (CSS vars can't override inline)
const darkPalette = {
  pageBg:        '#1a1f2e',
  cardBg:        '#242938',
  border:        '#2e3446',
  borderAccent:  'rgba(201,168,76,0.3)',
  textPrimary:   '#e6edf3',
  textSecondary: '#8892a4',
  textDim:       '#3a4058',
  inputBg:       '#1a1f2e',
  gold:          '#c9a84c',
};

const lightPalette = {
  pageBg:        '#f0f2f7',
  cardBg:        '#ffffff',
  border:        '#dde1ee',
  borderAccent:  'rgba(180,148,60,0.4)',
  textPrimary:   '#1a1f2e',
  textSecondary: '#5a6478',
  textDim:       '#9aa5b8',
  inputBg:       '#f8f9fc',
  gold:          '#b8922f',
};

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
  palette: typeof darkPalette;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggle: () => {},
  isDark: true,
  palette: darkPalette,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const preferred = stored ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'dark' : 'dark');
    setTheme(preferred);
    document.documentElement.setAttribute('data-theme', preferred);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'dark' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggle,
      isDark: theme === 'dark',
      palette: theme === 'dark' ? darkPalette : lightPalette,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
