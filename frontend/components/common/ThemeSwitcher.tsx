'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme, type Palette } from '@/contexts/ThemeContext';

const THEMES: { id: Palette; label: string; bg: string; accent: string }[] = [
  { id: 'midnight-gold', label: 'Midnight Gold', bg: '#0A0E1A', accent: '#C9A96E' },
  { id: 'desert-sand',   label: 'Desert Sand',   bg: '#F2EAD8', accent: '#C9A96E' },
  { id: 'emerald-elite', label: 'Emerald Elite', bg: '#0D2818', accent: '#D4AF72' },
  { id: 'rose-marble',   label: 'Rose Marble',   bg: '#F8F0EE', accent: '#C9A96E' },
  { id: 'obsidian-gold', label: 'Obsidian Gold', bg: '#0E0E0E', accent: '#C9A96E' },
  { id: 'blush-mirage',  label: 'Blush Mirage',  bg: '#FAF7F5', accent: '#D4A574' },
];

export default function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { activePalette, isDark, setPalette, setMode } = useTheme();

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="group"
      aria-label="Choose theme"
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        border: '1px solid rgba(201,169,110,0.30)',
        borderRadius: '999px',
        padding: '5px 10px',
        gap: '8px',
      }}
    >
      {/* Palette swatches */}
      <div className="flex items-center" style={{ gap: '7px' }}>
        {THEMES.map((t) => {
          const isActive = activePalette === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setPalette(t.id)}
              aria-label={t.label}
              aria-pressed={isActive}
              title={t.label}
              style={{
                width: isActive ? '18px' : '15px',
                height: isActive ? '18px' : '15px',
                borderRadius: '50%',
                background: `conic-gradient(from 135deg, ${t.bg} 50%, ${t.accent} 50%)`,
                border: isActive ? '1.5px solid #C9A96E' : '1.5px solid rgba(201,169,110,0.45)',
                outline: isActive ? '2px solid #C9A96E' : 'none',
                outlineOffset: '2px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                padding: 0,
                boxShadow: isActive ? '0 0 6px rgba(201,169,110,0.5)' : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = 'scale(1.25)';
                  el.style.border = '1.5px solid rgba(201,169,110,0.8)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = 'scale(1)';
                  el.style.border = '1.5px solid rgba(201,169,110,0.45)';
                }
              }}
            />
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '16px', background: 'rgba(201,169,110,0.35)', flexShrink: 0 }} />

      {/* Dark/Light toggle */}
      <button
        onClick={() => setMode(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="flex items-center justify-center transition-all hover:scale-110"
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          color: '#C9A96E',
          background: 'rgba(201,169,110,0.18)',
          border: '1.5px solid rgba(201,169,110,0.45)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </div>
  );
}
