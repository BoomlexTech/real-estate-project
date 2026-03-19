'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Palette = 'midnight-gold' | 'desert-sand' | 'emerald-elite' | 'rose-marble' | 'obsidian-gold' | 'blush-mirage';
export type Mode = 'dark' | 'light';
type Theme = 'dark' | 'light'; // backward compat alias

const VALID_PALETTES: Palette[] = ['midnight-gold', 'desert-sand', 'emerald-elite', 'rose-marble', 'obsidian-gold', 'blush-mirage'];
const DEFAULT_MODE: Record<Palette, Mode> = {
  'midnight-gold': 'dark',
  'desert-sand':   'light',
  'emerald-elite': 'dark',
  'rose-marble':   'light',
  'obsidian-gold': 'dark',
  'blush-mirage':  'light',
};

// Agent/Admin portal palette — used in inline styles (CSS vars can't override inline)
const darkPalette = {
  pageBg:        '#141928',
  cardBg:        '#1E2438',
  border:        '#283248',
  borderAccent:  'rgba(201,169,110,0.28)',
  textPrimary:   '#F0ECE4',
  textSecondary: '#8892A4',
  textDim:       '#3D4560',
  inputBg:       '#141928',
  gold:          '#C9A96E',
};

const lightPalette = {
  pageBg:        '#F5F0E8',
  cardBg:        '#FFFFFF',
  border:        '#DDD5C8',
  borderAccent:  'rgba(201,169,110,0.38)',
  textPrimary:   '#0D1120',
  textSecondary: '#4A5568',
  textDim:       '#8E9AB0',
  inputBg:       '#FDFAF5',
  gold:          '#7B6428',
};

interface ThemeContextType {
  // New multi-theme API
  palette: typeof darkPalette;
  activePalette: Palette;
  mode: Mode;
  setPalette: (p: Palette) => void;
  setMode: (m: Mode) => void;
  // Backward-compat API (admin/agent portals + ThemeToggle)
  theme: Theme;
  isDark: boolean;
  toggle: () => void;
  toggleTheme: () => void;
  themePreference: string;
  resolvedTheme: Theme;
  setThemePreference: (p: any) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  palette: darkPalette,
  activePalette: 'midnight-gold',
  mode: 'dark',
  setPalette: () => {},
  setMode: () => {},
  theme: 'dark',
  isDark: true,
  toggle: () => {},
  toggleTheme: () => {},
  themePreference: 'midnight-gold',
  resolvedTheme: 'dark',
  setThemePreference: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activePalette, setPaletteState] = useState<Palette>('midnight-gold');
  const [mode, setModeState] = useState<Mode>('dark');

  const isDark = mode === 'dark';

  const applyTheme = (p: Palette, m: Mode) => {
    document.documentElement.setAttribute('data-theme', `${p}-${m}`);
    if (m === 'light') {
      document.documentElement.setAttribute('data-light', '');
    } else {
      document.documentElement.removeAttribute('data-light');
    }
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute('content', m);
  };

  const setPalette = (p: Palette) => {
    setPaletteState(p);
    localStorage.setItem('themePreference', p);
    applyTheme(p, mode);
  };

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem('themeMode', m);
    applyTheme(activePalette, m);
  };

  // Backward-compat: ThemeToggle in admin/agent sidebars calls toggle()
  const toggle = () => setMode(mode === 'dark' ? 'light' : 'dark');
  const toggleTheme = toggle;

  useEffect(() => {
    const sp = localStorage.getItem('themePreference') as Palette | null;
    const sm = localStorage.getItem('themeMode') as Mode | null;
    const p: Palette = VALID_PALETTES.includes(sp as Palette) ? (sp as Palette) : 'midnight-gold';
    const m: Mode = sm === 'dark' || sm === 'light' ? sm : DEFAULT_MODE[p];
    setPaletteState(p);
    setModeState(m);
    applyTheme(p, m);
  }, []);

  return (
    <ThemeContext.Provider value={{
      palette: isDark ? darkPalette : lightPalette,
      activePalette,
      mode,
      setPalette,
      setMode,
      // Backward-compat
      theme: mode,
      isDark,
      toggle,
      toggleTheme,
      themePreference: activePalette,
      resolvedTheme: mode,
      setThemePreference: () => {},
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
