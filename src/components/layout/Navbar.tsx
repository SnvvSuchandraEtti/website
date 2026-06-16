import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import AmbientToggle from '@/components/ui/AmbientToggle';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Skills', path: '/skills' },
  { name: 'Experience', path: '/experience' },
  { name: 'Certificates', path: '/certificates' },
  { name: 'Contact', path: '/contact' },
] as const;

type NavItem = (typeof navLinks)[number];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-[padding,background-color,border-color] duration-300',
        isScrolled
          ? 'py-2.5 backdrop-blur-xl bg-background/85 border-b border-white/5'
          : 'py-4 bg-transparent border-b border-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-3">
        <Link
          to="/"
          className="flex items-center min-w-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Suchandra Etti — Home"
        >
          <span className="text-base xs:text-lg lg:text-xl 3xl:text-2xl font-bold tracking-tight text-foreground truncate">
            Suchandra Etti
          </span>
        </Link>

        {/* Desktop nav (lg+) */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.path} item={link} active={isActive(link.path)} />
          ))}
          <span className="mx-1 h-5 w-px bg-border/60" aria-hidden="true" />
          <AmbientToggle />
        </nav>

        {/* Mobile/tablet trigger (<lg) */}
        <div className="lg:hidden flex items-center gap-1">
          <AmbientToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="touch-target text-foreground"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              id="mobile-nav"
              side="right"
              className="w-[85vw] sm:w-[380px] bg-background/95 backdrop-blur-xl border-l border-white/10 pb-[env(safe-area-inset-bottom)]"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'min-h-12 px-4 rounded-lg flex items-center text-base transition-colors',
                        active
                          ? 'text-foreground bg-muted font-medium'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      )}
                    >
                      {link.name === 'Certificates' && (
                        <Award className="h-4 w-4 mr-2 opacity-70" aria-hidden="true" />
                      )}
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  item: NavItem;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ item, active }) => (
  <Link
    to={item.path}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'relative px-3.5 py-2 rounded-lg text-sm font-medium flex items-center transition-colors duration-200 outline-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      active
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
    )}
  >
    {item.name === 'Certificates' && (
      <Award className="h-3.5 w-3.5 mr-1 opacity-70" aria-hidden="true" />
    )}
    {item.name}
    {active && (
      <span
        aria-hidden="true"
        className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-foreground/70"
      />
    )}
  </Link>
);

export default Navbar;
