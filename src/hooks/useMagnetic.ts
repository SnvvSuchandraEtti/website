import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/utils/performance";

/**
 * Subtle magnetic-hover effect for CTAs.
 * Translates the element a few pixels toward the cursor on hover. No-op on
 * touch devices and when the user prefers reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.25, max = 6) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      const x = Math.max(-max, Math.min(max, dx));
      const y = Math.max(-max, Math.min(max, dy));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = "translate3d(0,0,0)";
      });
    };

    el.style.transition = "transform 220ms cubic-bezier(0.25,0.1,0.25,1)";
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
      cancelAnimationFrame(frame);
    };
  }, [strength, max]);

  return ref;
}
