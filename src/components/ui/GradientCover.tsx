import React from 'react';
import { cn } from '@/lib/utils';

interface GradientCoverProps {
  title: string;
  subtitle?: string;
  tags?: string[];
  color?: string;
  className?: string;
  compact?: boolean;
}

/** Darken a hex color by mixing it toward #0f172a. */
function darken(hex: string, amount = 0.55): string {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const mix = (c: number, t: number) => Math.round(c + (t - c) * amount);
  // Mix toward slate-900 (#0f172a)
  return `rgb(${mix(r, 15)}, ${mix(g, 23)}, ${mix(b, 42)})`;
}

const GradientCover: React.FC<GradientCoverProps> = ({
  title,
  subtitle,
  tags,
  color = '#6366F1',
  className,
  compact = false,
}) => {
  const dark = darken(color, 0.6);
  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden flex flex-col justify-between',
        compact ? 'p-3' : 'p-5',
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${dark} 100%)`,
      }}
      aria-hidden="false"
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
        }}
      />
      {/* Glow orb */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: color }}
      />

      <div className="relative z-10">
        {subtitle && (
          <div className="text-[10px] uppercase tracking-widest font-semibold text-white/70 mb-1">
            {subtitle}
          </div>
        )}
        <h3
          className={cn(
            'font-bold text-white leading-tight drop-shadow-sm',
            compact ? 'text-base line-clamp-3' : 'text-xl md:text-2xl line-clamp-3'
          )}
        >
          {title}
        </h3>
      </div>

      {tags && tags.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GradientCover;
