'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type ThemePreference = 'dark' | 'light' | 'system';

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
  themePreference: ThemePreference;
  resolvedTheme: Theme;
  setThemePreference: (p: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggle: () => {},
  isDark: true,
  palette: darkPalette,
  themePreference: 'system',
  resolvedTheme: 'dark',
  setThemePreference: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<Theme>('dark'); // safe SSR default

  useEffect(() => {
    const stored = localStorage.getItem('themePreference') as ThemePreference | null;
    const preference: ThemePreference = stored ?? 'system';
    setThemePreferenceState(preference);

    const resolve = (pref: ThemePreference): Theme =>
      pref === 'system'
        ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        : pref;

    const resolved = resolve(preference);
    setResolvedTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);

    // React to live OS changes when preference is 'system'
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onOsChange = () => {
      const current = (localStorage.getItem('themePreference') as ThemePreference | null) ?? 'system';
      if (current === 'system') {
        const next = resolve('system');
        setResolvedTheme(next);
        document.documentElement.setAttribute('data-theme', next);
      }
    };
    mq.addEventListener('change', onOsChange);
    return () => mq.removeEventListener('change', onOsChange);
  }, []);

  const applyResolved = (pref: ThemePreference) => {
    const resolved: Theme =
      pref === 'system'
        ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        : pref;
    setResolvedTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  };

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    localStorage.setItem('themePreference', pref);
    applyResolved(pref);
  };

  const toggleTheme = () => {
    const next: ThemePreference = resolvedTheme === 'dark' ? 'light' : 'dark';
    setThemePreference(next);
  };

  const toggle = toggleTheme; // backward compat

  return (
    <ThemeContext.Provider value={{
      theme: resolvedTheme,
      toggle,
      isDark: resolvedTheme === 'dark',
      palette: resolvedTheme === 'dark' ? darkPalette : lightPalette,
      themePreference,
      resolvedTheme,
      setThemePreference,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
