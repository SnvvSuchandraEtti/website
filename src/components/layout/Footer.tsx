import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowUpRight,
  Instagram,
  Code,
  MapPin,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Data ────────────────────────────────────────────────────────── */

const siteLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Skills', path: '/skills' },
  { name: 'Experience', path: '/experience' },
  { name: 'Certificates', path: '/certificates' },
  { name: 'Contact', path: '/contact' },
] as const;

const socials = [
  { href: 'https://github.com/SnvvSuchandraEtti', label: 'GitHub', Icon: Github },
  { href: 'https://linkedin.com/in/suchandra-etti', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://twitter.com/snvvs369', label: 'Twitter', Icon: Twitter },
  { href: 'https://instagram.com/suchandra369', label: 'Instagram', Icon: Instagram },
  { href: 'https://leetcode.com/u/snvvsuchandraetti/', label: 'LeetCode', Icon: Code },
  { href: 'mailto:snvvs369@gmail.com', label: 'Email', Icon: Mail },
] as const;

const contactDetails = [
  { label: 'Email', value: 'snvvs369@gmail.com', href: 'mailto:snvvs369@gmail.com', external: false },
  { label: 'Phone', value: '+91 7989 635 988', href: 'tel:+917989635988', external: false },
  { label: 'All links', value: 'linktr.ee/snvvs369', href: 'https://linktr.ee/snvvs369', external: true },
] as const;

/* ─── Sub-components ──────────────────────────────────────────────── */

/** External link with consistent arrow icon. */
const FooterLink: React.FC<{
  href: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ href, external = false, children, className }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className={cn(
      'group/link inline-flex items-center gap-1.5 text-muted-foreground transition-colors duration-200',
      'hover:text-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded',
      className
    )}
  >
    {children}
    <ArrowUpRight
      className="h-3 w-3 opacity-0 -translate-y-px translate-x-[-2px] transition-all duration-200 group-hover/link:opacity-70 group-hover/link:translate-x-0 group-hover/link:translate-y-0"
      aria-hidden="true"
    />
  </a>
);

/** Internal site link with active state awareness. */
const FooterNavLink: React.FC<{
  to: string;
  active: boolean;
  children: React.ReactNode;
}> = ({ to, active, children }) => (
  <Link
    to={to}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'text-sm transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded',
      active
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground'
    )}
  >
    {children}
  </Link>
);

/** Column header with eyebrow styling. */
const ColumnHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="eyebrow text-foreground/60 mb-6 select-none">{children}</h3>
);

/** Social icon button. */
const SocialIcon: React.FC<{
  href: string;
  label: string;
  Icon: React.FC<{ className?: string }>;
}> = ({ href, label, Icon }) => (
  <li>
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center h-9 w-9 rounded-lg',
        'border border-white/[0.06] bg-white/[0.02]',
        'text-muted-foreground transition-all duration-200',
        'hover:text-foreground hover:border-white/[0.12] hover:bg-white/[0.04]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </a>
  </li>
);

/* ─── Footer ──────────────────────────────────────────────────────── */

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const location = useLocation();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // Split links into two columns for the navigation grid.
  const navColA = useMemo(() => siteLinks.slice(0, 4), []);
  const navColB = useMemo(() => siteLinks.slice(4), []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative border-t border-white/[0.06] mt-auto"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      {/* ── Main footer grid ────────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-12 lg:gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-block mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
              aria-label="Suchandra Etti — Home"
            >
              <span className="text-lg font-bold tracking-tight text-foreground">
                Suchandra Etti
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-muted-foreground mb-6 max-w-[32ch]">
              Final-year B.Tech CSE student building full-stack, mobile, and AI
              products that ship to real users.
            </p>

            <ul className="flex flex-wrap gap-1.5" aria-label="Social profiles">
              {socials.map(({ href, label, Icon }) => (
                <SocialIcon key={label} href={href} label={label} Icon={Icon} />
              ))}
            </ul>
          </div>

          {/* Navigation column */}
          <nav aria-label="Footer navigation">
            <ColumnHeader>Navigate</ColumnHeader>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <ul className="space-y-3" role="list">
                {navColA.map((l) => (
                  <li key={l.path}>
                    <FooterNavLink to={l.path} active={isActive(l.path)}>
                      {l.name}
                    </FooterNavLink>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3" role="list">
                {navColB.map((l) => (
                  <li key={l.path}>
                    <FooterNavLink to={l.path} active={isActive(l.path)}>
                      {l.name}
                    </FooterNavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Contact column */}
          <div>
            <ColumnHeader>Contact</ColumnHeader>
            <ul className="space-y-3 text-sm" role="list">
              {contactDetails.map(({ label, value, href, external }) => (
                <li key={label}>
                  <FooterLink href={href} external={external}>
                    {value}
                  </FooterLink>
                </li>
              ))}
              <li className="pt-2">
                <span className="inline-flex items-start gap-2 text-muted-foreground/70 text-xs leading-relaxed">
                  <MapPin
                    className="h-3.5 w-3.5 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Aditya Engineering College
                    <br />
                    Mandapeta, Andhra Pradesh
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Status column */}
          <div>
            <ColumnHeader>Status</ColumnHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
                  aria-hidden="true"
                />
                <span className="text-sm text-foreground/80">
                  Open to opportunities
                </span>
              </div>
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                Internships, full-time roles,
                <br />
                and ambitious collaborations.
              </p>
              <Link
                to="/contact"
                className={cn(
                  'inline-flex items-center gap-2 h-9 px-4 rounded-full text-xs font-medium',
                  'border border-white/[0.1] text-muted-foreground',
                  'transition-all duration-200',
                  'hover:text-foreground hover:border-white/[0.18] hover:bg-white/[0.03]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                )}
              >
                Get in touch
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────── */}
      <div className="border-t border-white/[0.04]">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/50">
            © {year} Suchandra Etti. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground/40">
              Designed &amp; built with care.
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className={cn(
                'inline-flex items-center justify-center h-7 w-7 rounded-md',
                'border border-white/[0.06] text-muted-foreground/50',
                'transition-all duration-200',
                'hover:text-foreground hover:border-white/[0.14] hover:bg-white/[0.03]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
