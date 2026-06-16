import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight, Instagram, Code } from 'lucide-react';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Skills', path: '/skills' },
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

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Personal Brand */}
          <div>
            <p className="text-xl font-bold tracking-tight mb-3">Suchandra Etti</p>
            <p className="text-sm leading-relaxed text-muted-foreground mb-5 max-w-sm">
              Final-year B.Tech CSE student building full-stack, mobile, and AI products.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Social profiles">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/80 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/80 mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:snvvs369@gmail.com"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  snvvs369@gmail.com <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="tel:+917989635988"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  +91 7989635988 <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://linktr.ee/snvvs369"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  All links <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li className="pt-1 text-muted-foreground/80">
                Aditya Engineering College, Mandapeta
                <br />
                Andhra Pradesh, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {year} Suchandra Etti. All rights reserved.</p>
          <p>Designed &amp; built with care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
