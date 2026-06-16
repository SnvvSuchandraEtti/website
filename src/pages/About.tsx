import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';

import PageTransition from '@/components/ui/PageTransition';
import Navbar from '@/components/layout/Navbar';
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

const EMAIL = 'snvvs369@gmail.com';

const About: React.FC = () => {
  const shippedProjects = allProjects.filter((p) => p.featured).length || allProjects.length;
  const certCount = allCertificates.length;
  const internships = experiences.filter((e) =>
    /intern/i.test(e.title) || /intern/i.test(e.role || '')
  ).length;

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
          <SectionHeading
            as="h1"
            eyebrow="About"
            title="Engineer first, designer when it matters."
            subtitle="I'm Suchandra — a final-year B.Tech CSE student at Aditya Engineering College and a full-stack engineer focused on mobile, web, and AI. I build things, ship them to real users, and read the analytics afterwards."
            alignment="left"
          />

          {/* Quick facts strip — derived from data, no inflated stats */}
          <dl
            className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 pb-12 mb-16 border-b border-white/[0.08]"
            aria-label="Quick facts"
          >
            <Fact label="Based in" value="Andhra Pradesh, IN" />
            <Fact label="Studying" value="B.Tech CSE · 2022–26" />
            <Fact label="Shipped" value={`${shippedProjects} projects`} />
            <Fact label="Internships" value={`${internships}× Technical Hub`} />
          </dl>

          {/* Long-form narrative — recruiter-scannable, no card chrome */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
            <article className="space-y-16 prose-measure">
              <Section eyebrow="01" title="What I do">
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

              <Section eyebrow="02" title="How I work">
                <ul className="space-y-3">
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

              <Section eyebrow="03" title="Selected outcomes">
                <ul className="space-y-3">
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
                <p className="pt-2">
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                  >
                    See all projects <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </p>
              </Section>

              <Section eyebrow="04" title="Beyond code">
                <p>
                  I led <Em>LEO Club</Em> technical workshops as Program Coordinator
                  and directed a 15-volunteer "Movie Marathon" event. I've represented
                  my college at <Em>6+</Em> institutions for hackathons and quizzes,
                  and I've put <Em>500+</Em> DSA problems through LeetCode, GFG, and
                  CodeChef.
                </p>
              </Section>
            </article>

            {/* Sidebar — quiet, editorial. No glass, no chrome. */}
            <aside className="space-y-12 lg:pl-4 lg:border-l lg:border-white/[0.06]">
              <SidebarBlock title="Education">
                <EduRow
                  degree="B.Tech, Computer Science & Engineering"
                  institution="Aditya Engineering College"
                  period="2022 — present"
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
              </SidebarBlock>

              <SidebarBlock title="Languages">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Telugu <span className="opacity-50">— native</span>
                  <br />
                  English <span className="opacity-50">— professional</span>
                  <br />
                  Hindi <span className="opacity-50">— intermediate</span>
                </p>
              </SidebarBlock>

              <SidebarBlock title="Recognition">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AWS Certified Cloud Practitioner. {certCount} verified credentials
                  on file —{' '}
                  <Link
                    to="/certificates"
                    className="text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                  >
                    browse all
                  </Link>
                  .
                </p>
              </SidebarBlock>

              <SidebarBlock title="Reach me">
                <ul className="space-y-2.5 text-sm">
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

          {/* Closing CTA — single, restrained */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mt-24 pt-12 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4"
          >
            <p className="text-sm text-muted-foreground">
              Open to internships, full-time roles, and ambitious collaborations.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Get in touch <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
};

/* ---------- editorial primitives (file-local, no card chrome) ---------- */

const Fact: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="eyebrow mb-1.5">{label}</dt>
    <dd className="text-sm text-foreground">{value}</dd>
  </div>
);

const Section: React.FC<{ eyebrow: string; title: string; children: React.ReactNode }> = ({
  eyebrow,
  title,
  children,
}) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
  >
    <p className="eyebrow eyebrow-accent mb-3">{eyebrow}</p>
    <h2 className="fluid-h3 text-foreground mb-5">{title}</h2>
    <div className="fluid-body text-muted-foreground leading-[1.75] space-y-4">{children}</div>
  </motion.section>
);

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex gap-3 text-foreground/85">
    <span className="text-primary mt-2.5 h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
    <span>{children}</span>
  </li>
);

const Em: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-foreground">{children}</span>
);

const SidebarBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="eyebrow eyebrow-accent mb-3">{title}</h3>
    {children}
  </div>
);

const EduRow: React.FC<{ degree: string; institution: string; period: string }> = ({
  degree,
  institution,
  period,
}) => (
  <div className="py-2 first:pt-0 border-b border-white/[0.04] last:border-b-0">
    <p className="text-sm text-foreground">{degree}</p>
    <p className="text-xs text-muted-foreground mt-0.5">
      {institution} · <span className="font-mono">{period}</span>
    </p>
  </div>
);

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
      aria-label={`${label}: ${value}`}
      className="group inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
    >
      <span className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>
      <span>{value}</span>
    </a>
  </li>
);

export default About;
