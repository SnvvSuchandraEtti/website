import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import AmbientToggle from '@/components/ui/AmbientToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ImageWithSkeleton } from '@/components/ui/ImageWithSkeleton';

/* ─── Data ────────────────────────────────────────────────────────── */

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Skills', path: '/skills' },
  { name: 'Experience', path: '/experience' },
  { name: 'Certificates', path: '/certificates', icon: Award },
  { name: 'Contact', path: '/contact' },
] as const;

type NavItem = (typeof navLinks)[number];

/* ─── Magnetic hover hook ─────────────────────────────────────────── */

function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * strength);
      y.set((e.clientY - centerY) * strength);
    },
    [x, y, strength]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, springX, springY, handleMouseMove, handleMouseLeave };
}

/* ─── Sub-components ──────────────────────────────────────────────── */

/**
 * Desktop nav link with magnetic hover and animated pill indicator.
 */
const DesktopNavLink: React.FC<{
  item: NavItem;
  active: boolean;
  index: number;
}> = ({ item, active, index }) => {
  const hasIcon = 'icon' in item && item.icon;
  const { ref, springX, springY, handleMouseMove, handleMouseLeave } = useMagnetic(0.25);

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        ref={ref}
        to={item.path}
        aria-current={active ? 'page' : undefined}
        onClick={(e) => {
          if (active) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className={cn(
          'relative px-3.5 py-2 rounded-full text-[13px] font-medium',
          'flex items-center gap-1.5',
          'transition-colors duration-200 outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          active
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {/* Animated active pill background — shared layout animation */}
        {active && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute inset-0 rounded-full bg-primary/10 dark:bg-muted/60 ring-1 ring-primary/20 dark:ring-border"
            style={{ originY: '0px' }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 30,
              mass: 0.8,
            }}
          />
        )}
        {/* Hover glow — subtle radial behind the pill */}
        <span
          className={cn(
            'absolute inset-0 rounded-full opacity-0 transition-opacity duration-300',
            'bg-gradient-to-br from-primary/10 via-transparent to-accent/10',
            !active && 'group-hover:opacity-100'
          )}
          aria-hidden="true"
        />
        <span className="relative z-10 flex items-center gap-1.5">
          {hasIcon && (
            <item.icon
              className={cn(
                'h-3.5 w-3.5 shrink-0 transition-opacity duration-200',
                active ? 'opacity-90' : 'opacity-50'
              )}
              aria-hidden="true"
            />
          )}
          {item.name}
        </span>
      </Link>
    </motion.div>
  );
};

/**
 * Mobile nav link — staggered entrance with polished active state.
 */
const MobileNavLink: React.FC<{
  item: NavItem;
  active: boolean;
  index: number;
  onClose: () => void;
}> = ({ item, active, index, onClose }) => {
  const hasIcon = 'icon' in item && item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.06 * index + 0.1,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link
        to={item.path}
        aria-current={active ? 'page' : undefined}
        onClick={(e) => {
          if (active) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          onClose();
        }}
        className={cn(
          'group relative min-h-12 px-4 rounded-xl flex items-center gap-3',
          'text-[15px] transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          active
            ? 'text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {/* Active background */}
        {active && (
          <motion.span
            layoutId="mobile-active-pill"
            className="absolute inset-0 rounded-xl bg-primary/8 dark:bg-muted/50 ring-1 ring-primary/15 dark:ring-border/50"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-3 flex-1">
          {hasIcon && (
            <item.icon
              className={cn(
                'h-4 w-4 shrink-0 transition-opacity duration-200',
                active ? 'opacity-80' : 'opacity-40 group-hover:opacity-60'
              )}
              aria-hidden="true"
            />
          )}
          <span className="flex-1">{item.name}</span>
          {/* Active dot indicator */}
          {active && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"
              aria-hidden="true"
            />
          )}
        </span>
      </Link>
    </motion.div>
  );
};

/**
 * Vertical separator — used between nav links and utility controls.
 */
const NavDivider: React.FC = () => (
  <motion.span
    initial={{ opacity: 0, scaleY: 0 }}
    animate={{ opacity: 1, scaleY: 1 }}
    transition={{ delay: 0.4, duration: 0.3 }}
    className="mx-2 h-4 w-px bg-border"
    aria-hidden="true"
  />
);

/**
 * Scroll progress indicator bar at the bottom of the navbar.
 */
const ScrollProgress: React.FC = () => {
  const progress = useMotionValue(0);
  const scaleX = useSpring(progress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        progress.set(scrollTop / docHeight);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [progress]);

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-[1px] origin-left"
      style={{ scaleX }}
    >
      <div className="h-full w-full bg-gradient-to-r from-primary/70 via-accent/50 to-primary/30" />
    </motion.div>
  );
};

/* ─── Logo ────────────────────────────────────────────────────────── */

const NavLogo: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Link
      to="/"
      onClick={(e) => {
        if (isHome) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className={cn(
        'group flex items-center gap-2.5 min-w-0 rounded-lg',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-background'
    )}
    aria-label="Suchandra Etti — Home"
  >
    {/* Profile photo mark */}
    <motion.div
      className="relative flex items-center justify-center rounded-lg overflow-hidden fluid-nav-logo-img transition-transform duration-300"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <ImageWithSkeleton
        src="/assets/images/profile/suchandra-artistic.jpg"
        alt="Suchandra Etti"
        className="object-cover"
        loading="eager"
        decoding="async"
      />
      {/* Subtle shimmer sweep on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />
    </motion.div>
    {/* Wordmark */}
    <motion.span
      className="font-semibold tracking-tight text-foreground truncate fluid-nav-logo-text"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      Suchandra
      <span className="text-muted-foreground font-normal ml-1.5">Etti</span>
    </motion.span>
  </Link>
  );
};

/* ─── Navbar ──────────────────────────────────────────────────────── */

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();
  const rawProgress = useTransform(scrollY, [0, 50], [0, 1]);
  const progress = useSpring(rawProgress, { stiffness: 400, damping: 40 });

  const isHomePage = location.pathname === '/';

  /* ── Auto-hide Scroll Logic ─────────────────────────────────────── */

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isHomePage) {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    if (mobileMenuOpen) {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else if (scrollY.get() > 50) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsVisible(false), 2000);
    }
  }, [mobileMenuOpen, scrollY, isHomePage]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isHomePage) {
      setIsVisible(true);
      return;
    }

    if (mobileMenuOpen) return;

    const previous = lastScrollY.current;
    const diff = latest - previous;
    lastScrollY.current = latest;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (latest < 50) {
      setIsVisible(true);
      return;
    }

    if (diff < -5) {
      setIsVisible(true);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  });

  /* ── Close mobile menu on route change ────────────────────────── */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* ── Active state helper ──────────────────────────────────────── */

  const isActive = useCallback(
    (path: string) =>
      path === '/' ? location.pathname === '/' : location.pathname.startsWith(path),
    [location.pathname]
  );

  return (
    <motion.header
      role="banner"
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={isHomePage ? { 
        '--nav-layout-progress': progress,
        '--nav-bg-progress': progress 
      } as any : {
        '--nav-layout-progress': 0
      } as any}
      className="fixed top-0 inset-x-0 z-50 pointer-events-none"
    >
      {/* Floating container */}
      <div className={cn("pointer-events-auto", isHomePage ? "fluid-nav-container" : "w-full")}>
        <div className={cn(
          "relative", 
          isHomePage 
            ? "fluid-nav-inner overflow-hidden" 
            : "bg-background/95 backdrop-blur-md border-b border-border/50 py-2.5"
        )}>
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 lg:px-6">
            {/* ── Logo / wordmark ─────────────────────────────────────── */}
            <NavLogo />

            {/* ── Desktop navigation (lg+) ────────────────────────────── */}
            <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link, i) => (
                <DesktopNavLink
                  key={link.path}
                  item={link}
                  active={isActive(link.path)}
                  index={i}
                />
              ))}
              <NavDivider />
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <AmbientToggle />
                <ThemeToggle />
              </motion.div>
            </nav>

            {/* ── Mobile / tablet controls (<lg) ──────────────────────── */}
            <div className="lg:hidden flex items-center gap-1.5">
              <AmbientToggle />
              <ThemeToggle />

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'touch-target text-foreground relative overflow-hidden',
                      'focus-visible:ring-2 focus-visible:ring-ring',
                      'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      'rounded-xl hover:bg-muted'
                    )}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-nav"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={mobileMenuOpen ? 'close' : 'menu'}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {mobileMenuOpen ? (
                          <X className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Menu className="h-5 w-5" aria-hidden="true" />
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </Button>
                </SheetTrigger>

                <SheetContent
                  id="mobile-nav"
                  side="right"
                  className={cn(
                    'w-[85vw] sm:w-[380px]',
                    'bg-background/95 backdrop-blur-2xl backdrop-saturate-[1.3]',
                    'border-l border-border',
                    'pb-[env(safe-area-inset-bottom)]',
                    'flex flex-col'
                  )}
                >
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>

                  {/* Mobile header */}
                  <motion.div
                    className="px-4 pt-2 pb-4 border-b border-border"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary via-accent/80 to-primary flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">SE</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Navigation
                      </span>
                    </div>
                  </motion.div>

                  {/* Mobile nav links */}
                  <nav aria-label="Mobile" className="mt-4 flex flex-col gap-0.5 flex-1 px-2">
                    {navLinks.map((link, i) => (
                      <MobileNavLink
                        key={link.path}
                        item={link}
                        active={isActive(link.path)}
                        index={i}
                        onClose={() => setMobileMenuOpen(false)}
                      />
                    ))}
                  </nav>

                  {/* Mobile footer — availability + contact CTA */}
                  <motion.div
                    className="pt-6 mt-auto border-t border-border space-y-4 px-2"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 px-4">
                      <span className="relative flex h-2 w-2" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Open to opportunities
                      </span>
                    </div>
                    <Link
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'mx-2 mb-4 flex items-center justify-center gap-2',
                        'h-11 rounded-xl text-sm font-medium',
                        'bg-gradient-to-r from-primary to-accent text-white',
                        'shadow-lg shadow-primary/20',
                        'transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]',
                        'focus-visible:outline-none focus-visible:ring-2',
                        'focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                        'focus-visible:ring-offset-background'
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      Get in touch
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </motion.div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
