import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, ArrowDown } from 'lucide-react';
import ResumeButton from '../ui/ResumeButton';
import { useMagnetic } from '@/hooks/useMagnetic';
import suchandraMainAsset from '@/assets/profile/suchandra-main.png.asset.json';
const suchandraMain = suchandraMainAsset.url;

const TYPE_MS = 60;
const DELETE_MS = 35;
const HOLD_MS = 2200;
const PAUSE_MS = 600;

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
    if (reduceMotion) return; // honor user preference: skip typing animation
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
    <section className="relative min-h-dvh flex items-center overflow-hidden">
      {/* Calm static gradient wash — no particles, no pulsing blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground mb-8 min-h-[1.6em] font-mono text-sm"
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

            {/* Primary + secondary CTA — dominant, restrained */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <a
                ref={primaryCtaRef}
                href="/projects"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors will-change-transform"
              >
                View selected work
                <ArrowRight className="h-4 w-4" />
              </a>

            </motion.div>

            {/* Tertiary icon row — quiet, wraps cleanly on small screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-3 text-muted-foreground"
            >
              <a
                href="https://github.com/SnvvSuchandraEtti"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 text-sm"
                aria-label="GitHub profile"
              >
                <Github className="h-4 w-4" aria-hidden="true" /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/suchandra-etti"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 text-sm"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
              </a>
              <ResumeButton />
            </motion.div>
          </div>

          {/* Right — editorial portrait, no glow ring */}
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
                // lowercase form is the spec-correct HTML attribute
                {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)}
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div>
                  <p className="eyebrow text-foreground/70">Based in</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">Andhra Pradesh, IN</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur border border-white/[0.1] text-[11px] font-mono">
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${reduceMotion ? '' : 'animate-pulse'}`}
                    aria-hidden="true"
                  />
                  Available
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="eyebrow">Scroll</span>
        <ArrowDown className={`h-4 w-4 ${reduceMotion ? '' : 'animate-bounce'}`} aria-hidden="true" />
      </motion.a>
    </section>
  );
};

export default HeroSection;
