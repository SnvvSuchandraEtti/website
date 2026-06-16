import { useState, useEffect, useCallback } from 'react';

interface UseOptimizedScrollOptions {
  /** Pixels scrolled before `isScrolled` flips to true. */
  threshold?: number;
}

/**
 * rAF-throttled scroll listener that flips a boolean once the page passes
 * `threshold`. Cheaper than a state-per-pixel hook and SSR-safe.
 */
export const useOptimizedScroll = ({
  threshold = 10,
}: UseOptimizedScrollOptions = {}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const read = useCallback(() => {
    setIsScrolled(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        read();
        ticking = false;
      });
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [read]);

  return { isScrolled };
};
