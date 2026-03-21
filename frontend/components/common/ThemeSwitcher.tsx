'use client';
import { useState, useRef, useEffect } from 'react';
import { Palette as PaletteIcon } from 'lucide-react';
import { useTheme, type Palette, type Mode } from '@/contexts/ThemeContext';

type ModeOption    = { kind: 'mode';    id: Mode;    label: string; bg: string; text: string };
type PaletteOption = { kind: 'palette'; id: Palette; label: string; bg: string; accent: string };

const PALETTE_OPTIONS: PaletteOption[] = [
  { kind: 'palette', id: 'desert-sand',   label: 'Desert Sand', bg: '#EDE5D2', accent: '#C9A96E' },
  { kind: 'palette', id: 'emerald-elite', label: 'Emerald',     bg: '#0D2818', accent: '#D4AF72' },
  { kind: 'palette', id: 'blush-mirage',  label: 'Blush',       bg: '#F0EAE7', accent: '#D4A574' },
  { kind: 'palette', id: 'aurora-fusion', label: 'Aurora',      bg: '#0D1820', accent: '#C8A06A' },
];

const MODE_OPTIONS: ModeOption[] = [
  { kind: 'mode', id: 'light', label: 'Light', bg: '#F5F0E8', text: '#1a1a1a' },
  { kind: 'mode', id: 'dark',  label: 'Dark',  bg: '#0D1120', text: '#ffffff' },
];

const pillStyle = (active: boolean, bg: string, textColor: string, isDark: boolean) => ({
  padding: '5px 14px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: active ? 600 : 400,
  letterSpacing: '0.07em',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  border: active ? '1.5px solid #C9A96E' : `1.5px solid ${isDark ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)'}`,
  background: active ? bg : 'transparent',
  color: active ? textColor : (isDark ? '#1a1a1a' : '#ffffff'),
  boxShadow: active ? '0 0 10px rgba(201,169,110,0.30)' : 'none',
  outline: 'none',
  whiteSpace: 'nowrap' as const,
});

export { MODE_OPTIONS };

export default function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { activePalette, isDark, setPalette } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isPaletteActive = (opt: PaletteOption) => opt.id === activePalette;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 transition-all hover:opacity-80"
        style={{
          padding: '6px 12px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: isDark ? '#000000' : '#ffffff',
          background: isDark ? '#ffffff' : '#0D1120',
          border: '1.5px solid #C9A96E',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <PaletteIcon size={13} />
        Theme
      </button>

      {/* Dropdown — full-width bar below navbar */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--header-height, 88px)',
            left: 0,
            right: 0,
            zIndex: 40,
            background: isDark ? 'rgba(255,255,255,0.97)' : 'rgba(10,14,26,0.97)',
            borderBottom: '1px solid rgba(201,169,110,0.25)',
            borderTop: '1px solid rgba(201,169,110,0.15)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <div
            className="max-w-7xl mx-auto px-6 flex items-center justify-end gap-3"
            style={{ height: '52px' }}
          >
            {/* Palette options only */}
            {PALETTE_OPTIONS.map((opt) => {
              const active = isPaletteActive(opt);
              const textColor = opt.id === 'emerald-elite' || opt.id === 'aurora-fusion' ? '#ffffff' : '#1a1a1a';
              return (
                <button
                  key={opt.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => { setPalette(opt.id); setOpen(false); }}
                  title={opt.label}
                  style={pillStyle(active, opt.bg, textColor, isDark)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
