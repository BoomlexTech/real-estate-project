'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Palette = 'desert-sand' | 'emerald-elite' | 'blush-mirage' | 'aurora-fusion';
export type Mode = 'dark' | 'light';
type Theme = 'dark' | 'light'; // backward compat alias

const VALID_PALETTES: Palette[] = ['desert-sand', 'emerald-elite', 'blush-mirage', 'aurora-fusion'];
const DEFAULT_MODE: Record<Palette, Mode> = {
  'desert-sand':   'light',
  'emerald-elite': 'light',
  'blush-mirage':  'light',
  'aurora-fusion': 'light',
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
  palette: lightPalette,
  activePalette: 'aurora-fusion',
  mode: 'light',
  setPalette: () => {},
  setMode: () => {},
  theme: 'light',
  isDark: false,
  toggle: () => {},
  toggleTheme: () => {},
  themePreference: 'aurora-fusion',
  resolvedTheme: 'light',
  setThemePreference: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activePalette, setPaletteState] = useState<Palette>('aurora-fusion');
  const [mode, setModeState] = useState<Mode>('light');

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
    if (p === 'aurora-fusion') {
      const savedAuroraMode = (localStorage.getItem('auroraFusionMode') as Mode | null) ?? 'dark';
      setModeState(savedAuroraMode);
      applyTheme(p, savedAuroraMode);
    } else {
      setModeState('light');
      applyTheme(p, 'light');
    }
  };

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem('themeMode', m);
    if (activePalette === 'aurora-fusion') {
      localStorage.setItem('auroraFusionMode', m);
    }
    applyTheme(activePalette, m);
  };

  // Backward-compat: ThemeToggle in admin/agent sidebars calls toggle()
  const toggle = () => setMode(mode === 'dark' ? 'light' : 'dark');
  const toggleTheme = toggle;

  useEffect(() => {
    const sp = localStorage.getItem('themePreference') as Palette | null;
    const p: Palette = VALID_PALETTES.includes(sp as Palette) ? (sp as Palette) : 'aurora-fusion';
    let m: Mode = 'light';
    if (p === 'aurora-fusion') {
      const savedAuroraMode = localStorage.getItem('auroraFusionMode') as Mode | null;
      m = savedAuroraMode === 'dark' || savedAuroraMode === 'light' ? savedAuroraMode : 'dark';
    }
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
