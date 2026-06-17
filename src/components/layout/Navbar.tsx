import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Award, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import AmbientToggle from '@/components/ui/AmbientToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';

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

/* ─── Sub-components ──────────────────────────────────────────────── */

/**
 * Desktop nav link with active underline indicator.
 * The underline sits outside the pill so it reads as a tab indicator,
 * not a text decoration.
 */
const DesktopNavLink: React.FC<{
  item: NavItem;
  active: boolean;
}> = ({ item, active }) => {
  const hasIcon = 'icon' in item && item.icon;

  return (
    <Link
      to={item.path}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative px-3 py-2 rounded-lg text-[13px] font-medium',
        'flex items-center gap-1',
        'transition-colors duration-200 outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
      )}
    >
      {hasIcon && (
        <item.icon
          className={cn(
            'h-3.5 w-3.5 shrink-0',
            active ? 'opacity-80' : 'opacity-50'
          )}
          aria-hidden="true"
        />
      )}
      {item.name}
      {/* Active indicator — quiet underline */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-3 right-3 -bottom-[5px] h-px bg-foreground/60"
        />
      )}
    </Link>
  );
};

/**
 * Mobile nav link — larger touch targets, clear active state.
 */
const MobileNavLink: React.FC<{
  item: NavItem;
  active: boolean;
}> = ({ item, active }) => {
  const hasIcon = 'icon' in item && item.icon;

  return (
    <Link
      to={item.path}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'min-h-12 px-4 rounded-lg flex items-center gap-3',
        'text-[15px] transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active
          ? 'text-foreground bg-white/[0.06] font-medium'
          : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground'
      )}
    >
      {hasIcon && (
        <item.icon
          className={cn(
            'h-4 w-4 shrink-0',
            active ? 'opacity-80' : 'opacity-50'
          )}
          aria-hidden="true"
        />
      )}
      <span className="flex-1">{item.name}</span>
      {/* Quiet arrow on active item */}
      {active && (
        <span className="h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
      )}
    </Link>
  );
};

/**
 * Vertical separator — used between nav links and utility controls.
 */
const NavDivider: React.FC = () => (
  <span
    className="mx-1.5 h-4 w-px bg-white/[0.08]"
    aria-hidden="true"
  />
);

/* ─── Navbar ──────────────────────────────────────────────────────── */

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  /* ── Scroll detection ─────────────────────────────────────────── */

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
    <header
      role="banner"
      className={cn(
        'fixed top-0 inset-x-0 z-50',
        'transition-[padding,background-color,border-color,box-shadow] duration-300 ease-out',
        isScrolled
          ? 'py-2.5 backdrop-blur-xl bg-background/80 border-b border-white/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
          : 'py-4 bg-transparent border-b border-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* ── Logo / wordmark ─────────────────────────────────────── */}
        <Link
          to="/"
          className={cn(
            'flex items-center min-w-0 rounded-md',
            'outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          )}
          aria-label="Suchandra Etti — Home"
        >
          <span
            className={cn(
              'font-bold tracking-tight text-foreground truncate',
              'text-base xs:text-lg lg:text-xl 3xl:text-2xl',
              // Subtle size transition when scrolled
              isScrolled && 'lg:text-lg 3xl:text-xl'
            )}
          >
            Suchandra Etti
          </span>
        </Link>

        {/* ── Desktop navigation (lg+) ────────────────────────────── */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <DesktopNavLink
              key={link.path}
              item={link}
              active={isActive(link.path)}
            />
          ))}
          <NavDivider />
          <AmbientToggle />
          <ThemeToggle />
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
                  'touch-target text-foreground',
                  'focus-visible:ring-2 focus-visible:ring-ring',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                )}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>

            <SheetContent
              id="mobile-nav"
              side="right"
              className={cn(
                'w-[85vw] sm:w-[380px]',
                'bg-background/95 backdrop-blur-xl',
                'border-l border-white/[0.08]',
                'pb-[env(safe-area-inset-bottom)]',
                'flex flex-col'
              )}
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>

              {/* Mobile nav links */}
              <nav aria-label="Mobile" className="mt-8 flex flex-col gap-0.5 flex-1">
                {navLinks.map((link) => (
                  <MobileNavLink
                    key={link.path}
                    item={link}
                    active={isActive(link.path)}
                  />
                ))}
              </nav>

              {/* Mobile footer — availability + contact CTA */}
              <div className="pt-6 mt-auto border-t border-white/[0.06] space-y-4">
                <div className="flex items-center gap-2 px-4">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
                    aria-hidden="true"
                  />
                  <span className="text-xs text-muted-foreground">
                    Open to opportunities
                  </span>
                </div>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'mx-4 flex items-center justify-center gap-2',
                    'h-10 rounded-full text-sm font-medium',
                    'bg-foreground text-background',
                    'transition-colors duration-200 hover:bg-foreground/90',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                    'focus-visible:ring-offset-background'
                  )}
                >
                  Get in touch
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
