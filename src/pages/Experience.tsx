import React, { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { experiences } from '@/data/experience';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import PageTransition from '@/components/ui/PageTransition';
import SEO from '@/components/seo/SEO';

const Experience: React.FC = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  // Sort chronologically
  const sorted = useMemo(
    () => [...experiences].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
    []
  );

  // Hash anchor scrolling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [location, reduceMotion]);

  return (
    <PageTransition>
      <div className="min-h-dvh flex flex-col">
        <SEO
          title="Experience"
          description="Internships, leadership and startup co-founder experience — Technical Hub, LEO Club, and Leez."
          path="/experience"
        />
        <Navbar />

        <main className="flex-grow pt-28 pb-24">
          <div className="container mx-auto px-4 max-w-[1000px]">
            <SectionHeading
              as="h1"
              eyebrow="Experience · 2023 — present"
              title="Roles, internships, and what came out of them."
              subtitle="A chronological record of where I've worked, what I built, and what I learned."
              alignment="left"
            />

            <ol className="relative space-y-20 mt-16" aria-label="Work history">
              {/* Timeline Rule */}
              <span
                className="absolute left-[5px] sm:left-[11px] top-3 bottom-12 w-[1px] bg-border"
                aria-hidden="true"
              />

              {sorted.map((exp, index) => (
                <motion.li
                  id={exp.id}
                  key={exp.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.2) }}
                  className="relative pl-10 sm:pl-16 scroll-mt-32 list-none group"
                >
                  {/* Timeline Dot */}
                  <span
                    className="absolute left-0 sm:left-2 top-2.5 w-3 h-3 rounded-full border-[3px] border-background bg-primary shadow-[0_0_0_1px_hsl(var(--border))] group-hover:bg-accent group-hover:shadow-[0_0_0_1px_hsl(var(--border))] transition-all duration-300 z-10"
                    aria-hidden="true"
                  />

                  {/* Header */}
                  <header className="mb-4">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/80 mb-2">
                      <time dateTime={new Date(exp.startDate).toISOString()}>{exp.startDate}</time>
                      <span className="mx-2 text-muted-foreground/30">/</span>
                      <time dateTime={exp.endDate && exp.endDate.toLowerCase() !== 'present' ? new Date(exp.endDate).toISOString() : undefined}>{exp.endDate || 'Present'}</time>
                      <span className="mx-2 text-muted-foreground/30">/</span>
                      <span className="text-foreground/60">{exp.location}</span>
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-1">
                      {exp.role || exp.title}
                    </h2>
                    
                    <p className="flex items-center gap-2 text-[15px] font-medium text-muted-foreground">
                      <span>{exp.company}</span>
                      {exp.website && (
                        <a
                          href={exp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${exp.company} website (opens in new tab)`}
                          className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </p>
                  </header>

                  {/* Body */}
                  <div className="prose-measure text-[15px] leading-relaxed text-muted-foreground/90 space-y-6">
                    <p>{exp.description}</p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-3">
                        {exp.achievements.map((a, i) => (
                          <li key={i} className="relative pl-6">
                            <span 
                              className="absolute left-0 top-[0.55rem] h-[5px] w-[5px] rounded-full bg-primary/60 ring-2 ring-primary/10" 
                              aria-hidden="true" 
                            />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Footer Stack */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <ul
                      className="flex flex-wrap gap-2 mt-8"
                      aria-label={`${exp.role || exp.title} stack`}
                    >
                      {exp.technologies.map((t) => (
                        <li
                          key={t}
                          className="px-2.5 py-1 text-[11px] font-mono text-muted-foreground border border-border bg-muted/30 rounded-md transition-colors hover:border-foreground/20 hover:text-foreground"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
            </ol>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Experience;
