'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative w-9 h-9 rounded-full glass flex items-center justify-center"
        aria-label="Changer de thème"
      >
        <span className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-9 h-9 rounded-full glass flex items-center justify-center transition-all duration-300 hover:scale-105 hover:border-[rgba(255,255,255,0.15)] cursor-pointer"
      aria-label="Changer de thème"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-brand-orange" />
      ) : (
        <Moon className="w-4 h-4 text-brand-teal" />
      )}
    </button>
  );
}
