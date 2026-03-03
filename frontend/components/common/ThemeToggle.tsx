'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-opacity hover:opacity-80 ${className}`}
      style={{ color: '#C9A96E', background: 'rgba(201,169,110,0.1)' }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
