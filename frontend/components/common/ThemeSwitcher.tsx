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
      className={`flex items-center gap-2 ${className}`}
      role="group"
      aria-label="Choose theme"
    >
      {/* Palette swatches */}
      <div className="flex items-center gap-1.5">
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
                width: isActive ? '13px' : '11px',
                height: isActive ? '13px' : '11px',
                borderRadius: '50%',
                background: `conic-gradient(from 135deg, ${t.bg} 50%, ${t.accent} 50%)`,
                border: '1px solid rgba(201,169,110,0.3)',
                outline: isActive ? '1.5px solid #C9A96E' : 'none',
                outlineOffset: '2px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                padding: 0,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            />
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '14px', background: 'rgba(201,169,110,0.25)', flexShrink: 0 }} />

      {/* Dark/Light toggle */}
      <button
        onClick={() => setMode(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="flex items-center justify-center rounded-lg transition-opacity hover:opacity-80"
        style={{
          width: '28px',
          height: '28px',
          color: '#C9A96E',
          background: 'rgba(201,169,110,0.1)',
          flexShrink: 0,
        }}
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  );
}
