import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ThemeToggle – toggles dark / light mode.
 * Persists user choice in localStorage under 'theme'.
 * Falls back to system preference on first load.
 */
const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply class to <html> element and store preference
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return (
    <button
      type="button"
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-md',
        'border border-border text-muted-foreground',
        'hover:text-foreground hover:bg-muted transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isDark && 'text-foreground bg-muted',
        className
      )}
    >
      {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
    </button>
  );
};

export default ThemeToggle;
