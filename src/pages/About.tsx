import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  GraduationCap,
  Globe,
  Award,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import PageTransition from '@/components/ui/PageTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import SEO from '@/components/seo/SEO';

import { projects as allProjects } from '@/data/projects';
import { certificates as allCertificates } from '@/data/certificates';
import { experiences } from '@/data/experience';

/**
 * Editorial "About" page.
 *
 * Single source of truth for prose — counts come from data, deep dives link
 * out to /experience, /projects, /skills, /certificates rather than re-listing
 * the same content in inflated cards.
 */

/* ─── Constants ───────────────────────────────────────────────────── */

const EMAIL = 'snvvs369@gmail.com';

/* ─── Editorial primitives ────────────────────────────────────────── */

/** Definition list item — label/value pair with proper dt/dd semantics. */
const Fact: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="eyebrow mb-1.5">{label}</dt>
    <dd className="text-sm text-foreground font-medium">{value}</dd>
  </div>
);

/** Numbered prose section with fade-in. */
const Section: React.FC<{
  eyebrow: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}> = ({ eyebrow, title, id, children }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
    aria-labelledby={id ? `${id}-heading` : undefined}
  >
    <p className="eyebrow eyebrow-accent mb-3" aria-hidden="true">{eyebrow}</p>
    <h2
      id={id ? `${id}-heading` : undefined}
      className="fluid-h3 text-foreground mb-5"
    >
      {title}
    </h2>
    <div className="fluid-body text-muted-foreground leading-[1.75] space-y-4">
      {children}
    </div>
  </motion.section>
);

/** Bullet list item with primary dot indicator. */
const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex gap-3 text-foreground/85">
    <span
      className="mt-2.5 h-1 w-1 rounded-full bg-primary shrink-0"
      aria-hidden="true"
    />
    <span>{children}</span>
  </li>
);

/** Inline text emphasis — lifts a word to foreground color. */
const Em: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-foreground font-medium">{children}</span>
);

/** Sidebar content block with icon header. */
const SidebarBlock: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div>
    <h3 className="eyebrow eyebrow-accent mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

/** Education row — degree + institution + period. */
const EduRow: React.FC<{
  degree: string;
  institution: string;
  period: string;
  current?: boolean;
}> = ({ degree, institution, period, current = false }) => (
  <div className="py-3 first:pt-0 border-b border-white/[0.04] last:border-b-0">
    <p className="text-sm text-foreground flex items-center gap-2">
      {degree}
      {current && (
        <span className="text-[10px] font-mono text-primary/80 border border-primary/20 rounded px-1.5 py-0.5">
          Current
        </span>
      )}
    </p>
    <p className="text-xs text-muted-foreground mt-1">
      {institution} · <time className="font-mono">{period}</time>
    </p>
  </div>
);

/** Language proficiency row. */
const LangRow: React.FC<{
  language: string;
  level: string;
}> = ({ language, level }) => (
  <li className="flex items-center justify-between text-sm py-1.5 first:pt-0">
    <span className="text-foreground/90">{language}</span>
    <span className="text-xs text-muted-foreground/60 font-mono">{level}</span>
  </li>
);

/** Sidebar contact link with icon + animated arrow. */
const ContactLink: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  external?: boolean;
}> = ({ href, icon, label, value, external = true }) => (
  <li>
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={`${label}: ${value}${external ? ' (opens in new tab)' : ''}`}
      className={cn(
        'group/contact inline-flex items-center gap-2.5 py-1',
        'text-foreground/90 transition-colors duration-200',
        'hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded'
      )}
    >
      <span className="text-muted-foreground/60 group-hover/contact:text-primary transition-colors duration-200">
        {icon}
      </span>
      <span className="text-sm">{value}</span>
      {external && (
        <ExternalLink
          className="h-3 w-3 opacity-0 -translate-y-px transition-all duration-200 group-hover/contact:opacity-40 group-hover/contact:translate-y-0"
          aria-hidden="true"
        />
      )}
    </a>
  </li>
);

/** Internal cross-link styled as a quiet underline. */
const CrossLink: React.FC<{
  to: string;
  children: React.ReactNode;
}> = ({ to, children }) => (
  <Link
    to={to}
    className={cn(
      'inline-flex items-center gap-1.5 text-sm text-foreground',
      'border-b border-white/[0.12] pb-0.5',
      'transition-colors duration-200 hover:border-foreground hover:text-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded'
    )}
  >
    {children}
    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
  </Link>
);

/* ─── Page ────────────────────────────────────────────────────────── */

const About: React.FC = () => {
  const shippedProjects = useMemo(
    () => allProjects.filter((p) => p.featured).length || allProjects.length,
    []
  );
  const certCount = useMemo(() => allCertificates.length, []);
  const internships = useMemo(
    () =>
      experiences.filter(
        (e) => /intern/i.test(e.title) || /intern/i.test(e.role || '')
      ).length,
    []
  );

  return (
    <PageTransition>
      <SEO
        title="About"
        description="Suchandra Etti — final-year B.Tech CSE student and full-stack engineer building Flutter, React and AI products used by 28K+ people."
        path="/about"
      />
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-[1100px]">
          {/* ── Page header ───────────────────────────────────────── */}
          <SectionHeading
            as="h1"
            eyebrow="About"
            title="Engineer first, designer when it matters."
            subtitle="I'm Suchandra — a final-year B.Tech CSE student at Aditya Engineering College and a full-stack engineer focused on mobile, web, and AI. I build things, ship them to real users, and read the analytics afterwards."
            alignment="left"
          />

          {/* ── Quick facts strip ─────────────────────────────────── */}
          <dl
            className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 pb-12 mb-16 border-b border-white/[0.08]"
            aria-label="Quick facts"
          >
            <Fact label="Based in" value="Andhra Pradesh, IN" />
            <Fact label="Studying" value="B.Tech CSE · 2022–26" />
            <Fact label="Shipped" value={`${shippedProjects} projects`} />
            <Fact label="Internships" value={`${internships}× Technical Hub`} />
          </dl>

          {/* ── Two-column narrative + sidebar ─────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 lg:gap-20">
            {/* Main narrative column */}
            <article className="space-y-16 prose-measure">
              <Section eyebrow="01" title="What I do" id="what-i-do">
                <p>
                  I design and build production-grade software end-to-end. On the front
                  I work in <Em>Flutter</Em>, <Em>React</Em>, and <Em>React Native</Em>;
                  on the back, <Em>Node.js</Em>, <Em>Express</Em>, and{' '}
                  <Em>Firebase / MongoDB</Em>. I lean on <Em>Python</Em> and{' '}
                  <Em>Java</Em> when the work calls for it.
                </p>
                <p>
                  My focus is shipping. Most of what I build is measured — engagement,
                  performance, defect rate — and iterated until the numbers move.
                </p>
              </Section>

              <Section eyebrow="02" title="How I work" id="how-i-work">
                <ul className="space-y-3" role="list">
                  <Bullet>
                    <Em>Prototype the critical path first.</Em> Real workflow before
                    feature surface area.
                  </Bullet>
                  <Bullet>
                    <Em>Instrument from day one.</Em> If it isn't measured, it isn't
                    finished.
                  </Bullet>
                  <Bullet>
                    <Em>Performance is a feature.</Em> Budgets enforced on critical
                    routes; CI/CD with automated checks.
                  </Bullet>
                  <Bullet>
                    <Em>Write for the next engineer.</Em> Small components, clear names,
                    no clever tricks.
                  </Bullet>
                </ul>
              </Section>

              <Section eyebrow="03" title="Selected outcomes" id="outcomes">
                <ul className="space-y-3" role="list">
                  <Bullet>
                    HOOT 2.0 — EdTech platform supporting <Em>10,000+</Em> concurrent
                    users; 45% engagement lift, 95% test coverage.
                  </Bullet>
                  <Bullet>
                    S-Track — role-based profile tracking for <Em>18,000+</Em> students
                    and staff; 70% reduction in admin overhead.
                  </Bullet>
                  <Bullet>
                    AI Background Remover — <Em>95%</Em> accuracy at scale,
                    1,000+ daily requests, 60% faster than the baseline.
                  </Bullet>
                  <Bullet>
                    ACLUB — Firebase-backed clubs platform; 40% participation lift,
                    98% positive feedback.
                  </Bullet>
                </ul>
                <div className="pt-3">
                  <CrossLink to="/projects">See all projects</CrossLink>
                </div>
              </Section>

              <Section eyebrow="04" title="Beyond code" id="beyond-code">
                <p>
                  I led <Em>LEO Club</Em> technical workshops as Program Coordinator
                  and directed a 15-volunteer "Movie Marathon" event. I've represented
                  my college at <Em>6+</Em> institutions for hackathons and quizzes,
                  and I've put <Em>500+</Em> DSA problems through LeetCode, GFG, and
                  CodeChef.
                </p>
                <div className="pt-3">
                  <CrossLink to="/experience">Full experience timeline</CrossLink>
                </div>
              </Section>
            </article>

            {/* ── Sidebar — quiet, editorial ──────────────────────── */}
            <aside
              className="space-y-10 lg:pl-6 lg:border-l lg:border-white/[0.06]"
              aria-label="Supplementary information"
            >
              <SidebarBlock
                title="Education"
                icon={<GraduationCap className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />}
              >
                <div className="space-y-0">
                  <EduRow
                    degree="B.Tech, Computer Science & Engineering"
                    institution="Aditya Engineering College"
                    period="2022 — present"
                    current
                  />
                  <EduRow
                    degree="Intermediate, PCM"
                    institution="Aditya Junior College"
                    period="2021 — 2022"
                  />
                  <EduRow
                    degree="SSC"
                    institution="Mandapeta Public School"
                    period="2020"
                  />
                </div>
              </SidebarBlock>

              <SidebarBlock
                title="Languages"
                icon={<Globe className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />}
              >
                <ul className="space-y-0" role="list">
                  <LangRow language="Telugu" level="Native" />
                  <LangRow language="English" level="Professional" />
                  <LangRow language="Hindi" level="Intermediate" />
                </ul>
              </SidebarBlock>

              <SidebarBlock
                title="Recognition"
                icon={<Award className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />}
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AWS Certified Cloud Practitioner.{' '}
                  <span className="text-foreground/80 font-mono text-xs">
                    {certCount}
                  </span>{' '}
                  verified credentials on file —{' '}
                  <Link
                    to="/certificates"
                    className={cn(
                      'text-foreground hover:text-primary transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded'
                    )}
                  >
                    browse all
                  </Link>
                  .
                </p>
              </SidebarBlock>

              <SidebarBlock
                title="Reach me"
                icon={<MapPin className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />}
              >
                <ul className="space-y-1.5" role="list">
                  <ContactLink
                    href={`mailto:${EMAIL}`}
                    icon={<Mail className="h-3.5 w-3.5" aria-hidden="true" />}
                    label="Email"
                    value={EMAIL}
                    external={false}
                  />
                  <ContactLink
                    href="https://github.com/SnvvSuchandraEtti"
                    icon={<Github className="h-3.5 w-3.5" aria-hidden="true" />}
                    label="GitHub"
                    value="SnvvSuchandraEtti"
                  />
                  <ContactLink
                    href="https://linkedin.com/in/suchandra-etti"
                    icon={<Linkedin className="h-3.5 w-3.5" aria-hidden="true" />}
                    label="LinkedIn"
                    value="suchandra-etti"
                  />
                </ul>
              </SidebarBlock>
            </aside>
          </div>

          {/* ── Closing CTA ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mt-24 pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-6"
          >
            <div>
              <p className="text-foreground font-medium text-sm mb-1">
                Let's build something together.
              </p>
              <p className="text-sm text-muted-foreground/70">
                Open to internships, full-time roles, and ambitious collaborations.
              </p>
            </div>
            <Link
              to="/contact"
              className={cn(
                'inline-flex items-center gap-2 h-11 px-6 rounded-full',
                'bg-foreground text-background font-medium text-sm',
                'transition-colors duration-200 hover:bg-foreground/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default About;
