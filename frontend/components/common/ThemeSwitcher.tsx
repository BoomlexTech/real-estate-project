'use client';
import { useTheme, type Palette } from '@/contexts/ThemeContext';
import type { Mode } from '@/contexts/ThemeContext';

type ThemeOption =
  | { kind: 'mode'; id: Mode; label: string; bg: string; text: string }
  | { kind: 'palette'; id: Palette; label: string; bg: string; accent: string };

const OPTIONS: ThemeOption[] = [
  { kind: 'mode',    id: 'light',         label: 'Light',        bg: '#F5F0E8', text: '#1a1a1a' },
  { kind: 'mode',    id: 'dark',          label: 'Dark',         bg: '#0D1120', text: '#ffffff' },
  { kind: 'palette', id: 'desert-sand',   label: 'Desert Sand',  bg: '#EDE5D2', accent: '#C9A96E' },
  { kind: 'palette', id: 'emerald-elite', label: 'Emerald',      bg: '#0D2818', accent: '#D4AF72' },
  { kind: 'palette', id: 'blush-mirage',  label: 'Blush',        bg: '#F0EAE7', accent: '#D4A574' },
  { kind: 'palette', id: 'aurora-fusion', label: 'Aurora',       bg: '#0D1820', accent: '#C8A06A' },
];

export default function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { activePalette, isDark, setPalette, setMode } = useTheme();

  const isActive = (opt: ThemeOption) => {
    if (opt.kind === 'mode') return opt.id === (isDark ? 'dark' : 'light');
    return opt.id === activePalette;
  };

  const handleClick = (opt: ThemeOption) => {
    if (opt.kind === 'mode') {
      setMode(opt.id);
    } else {
      setPalette(opt.id);
    }
  };

  return (
    <div
      className={`flex items-center ${className}`}
      role="radiogroup"
      aria-label="Choose theme"
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        border: '1px solid rgba(201,169,110,0.30)',
        borderRadius: '999px',
        padding: '4px 6px',
        gap: '4px',
      }}
    >
      {OPTIONS.map((opt) => {
        const active = isActive(opt);
        const bg = opt.kind === 'mode' ? opt.bg : opt.bg;
        const labelColor = opt.kind === 'mode' ? opt.text : (opt.id === 'emerald-elite' || opt.id === 'aurora-fusion' ? '#ffffff' : '#1a1a1a');

        return (
          <button
            key={opt.kind + opt.id}
            role="radio"
            aria-checked={active}
            onClick={() => handleClick(opt)}
            title={opt.label}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: active ? 600 : 400,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: active ? '1.5px solid #C9A96E' : '1.5px solid transparent',
              background: active ? bg : 'transparent',
              color: active ? labelColor : 'var(--text-primary)',
              boxShadow: active ? '0 0 8px rgba(201,169,110,0.35)' : 'none',
              outline: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
