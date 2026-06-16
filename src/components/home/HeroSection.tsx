import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, ArrowDown } from 'lucide-react';
import ResumeButton from '../ui/ResumeButton';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/utils';
import suchandraMainAsset from '@/assets/profile/suchandra-main.png.asset.json';
const suchandraMain = suchandraMainAsset.url;

/* ─── Typing animation config ─────────────────────────────────────── */

const TYPE_MS = 60;
const DELETE_MS = 35;
const HOLD_MS = 2200;
const PAUSE_MS = 600;

/* ─── Sub-components ──────────────────────────────────────────────── */

/** Quiet social link for the tertiary row. */
const SocialLink: React.FC<{
  href: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ href, label, icon, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={cn(
      'inline-flex items-center gap-1.5 text-sm text-muted-foreground',
      'transition-colors duration-200 hover:text-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded'
    )}
  >
    {icon}
    {children}
  </a>
);

/** Badge overlay on the portrait. */
const PortraitBadge: React.FC<{
  label: string;
  value: string;
  position?: 'left' | 'right';
}> = ({ label, value, position = 'left' }) => (
  <div className={position === 'right' ? 'text-right' : ''}>
    <p className="eyebrow text-foreground/60">{label}</p>
    <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
  </div>
);

/* ─── Hero ────────────────────────────────────────────────────────── */

const HeroSection: React.FC = () => {
  const titles = useMemo(
    () => ['Flutter Developer', 'Full-Stack Engineer', 'AI Builder', 'Product-minded'],
    []
  );
  const reduceMotion = useReducedMotion();
  const [typedText, setTypedText] = useState(() => (reduceMotion ? titles[0] : ''));
  const primaryCtaRef = useMagnetic<HTMLAnchorElement>(0.25, 6);

  // Single self-rescheduling timer; no setInterval reassignment race.
  useEffect(() => {
    if (reduceMotion) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let titleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const tick = () => {
      if (cancelled) return;
      const current = titles[titleIdx];
      if (deleting) {
        charIdx -= 1;
        setTypedText(current.substring(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          titleIdx = (titleIdx + 1) % titles.length;
          timer = setTimeout(tick, PAUSE_MS);
          return;
        }
        timer = setTimeout(tick, DELETE_MS);
      } else {
        charIdx += 1;
        setTypedText(current.substring(0, charIdx));
        if (charIdx === current.length) {
          deleting = true;
          timer = setTimeout(tick, HOLD_MS);
          return;
        }
        timer = setTimeout(tick, TYPE_MS);
      }
    };

    timer = setTimeout(tick, TYPE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [titles, reduceMotion]);

  return (
    <section
      className="relative min-h-dvh flex items-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* Calm static gradient wash — no particles, no pulsing blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(45% 35% at 18% 22%, hsl(var(--primary) / 0.10), transparent 70%), radial-gradient(40% 30% at 82% 78%, hsl(var(--accent) / 0.08), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="container mx-auto max-w-[1400px] py-32 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-14 lg:gap-20 items-center">
          {/* Left — editorial content */}
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow eyebrow-accent mb-6"
            >
              Suchandra Etti — Portfolio · 2026
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="fluid-h1 text-foreground mb-6"
            >
              Building products
              <br />
              that ship to <span className="text-primary">real users.</span>
            </motion.h1>

            {/* Accessible role text for screen readers */}
            <span className="sr-only">
              Flutter Developer, Full-Stack Engineer, AI Builder, Product-minded
            </span>

            {/* Typing animation — purely decorative */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 min-h-[1.6em] font-mono text-sm"
              aria-hidden="true"
            >
              <span className="text-foreground/80">{typedText}</span>
              {!reduceMotion && (
                <span className="ml-0.5 inline-block w-[2px] h-[0.95em] bg-primary/70 align-middle animate-pulse" />
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="fluid-lead text-muted-foreground prose-measure mb-10"
            >
              I'm a final-year CSE student and full-stack engineer focused on mobile,
              web, and AI. I've shipped Flutter and React apps to{' '}
              <span className="text-foreground">28,000+ users</span> across edtech,
              marketplaces, and tooling.
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <Link
                ref={primaryCtaRef}
                to="/projects"
                className={cn(
                  'inline-flex items-center gap-2 h-11 px-6 rounded-full',
                  'bg-foreground text-background font-medium text-sm',
                  'transition-colors duration-200 hover:bg-foreground/90',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  'will-change-transform'
                )}
              >
                View selected work
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>

            {/* Tertiary social row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              <SocialLink
                href="https://github.com/SnvvSuchandraEtti"
                label="GitHub profile"
                icon={<Github className="h-4 w-4" aria-hidden="true" />}
              >
                GitHub
              </SocialLink>
              <SocialLink
                href="https://linkedin.com/in/suchandra-etti"
                label="LinkedIn profile"
                icon={<Linkedin className="h-4 w-4" aria-hidden="true" />}
              >
                LinkedIn
              </SocialLink>
              <ResumeButton />
            </motion.div>
          </div>

          {/* Right — editorial portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.08]">
              <img
                src={suchandraMain}
                alt="Suchandra Etti"
                width={520}
                height={650}
                loading="eager"
                {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)}
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
              {/* Quiet gradient for text legibility */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <PortraitBadge label="Based in" value="Andhra Pradesh, IN" />
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
                    'bg-background/70 backdrop-blur border border-white/[0.1]',
                    'text-[11px] font-mono text-foreground/90'
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full bg-emerald-400',
                      !reduceMotion && 'animate-pulse'
                    )}
                    aria-hidden="true"
                  />
                  Available
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-label="Scroll to about section"
        className={cn(
          'absolute bottom-8 left-1/2 -translate-x-1/2',
          'flex flex-col items-center gap-2',
          'text-muted-foreground transition-colors duration-200 hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded'
        )}
      >
        <span className="eyebrow">Scroll</span>
        <ArrowDown
          className={cn('h-4 w-4', !reduceMotion && 'animate-bounce')}
          aria-hidden="true"
        />
      </motion.a>
    </section>
  );
};

export default HeroSection;
