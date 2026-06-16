import React, { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { experiences } from '@/data/experience';
import Navbar from '@/components/layout/Navbar';
import SectionHeading from '@/components/ui/SectionHeading';
import SmoothTransition from '@/components/ui/SmoothTransition';
import { ExternalLink } from 'lucide-react';
import SEO from '@/components/seo/SEO';

const Experience: React.FC = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  // Sort once per data change, not on every render.
  const sorted = useMemo(
    () =>
      [...experiences].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ),
    []
  );

  // Hash anchors → smooth (respecting motion preference); otherwise reset.
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
    <SmoothTransition>
      <div className="min-h-dvh flex flex-col">
        <SEO
          title="Experience"
          description="Internships, leadership and startup co-founder experience — Technical Hub, LEO Club, and Leez."
          path="/experience"
        />
        <Navbar />

        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-[1000px]">
            <SectionHeading
              as="h1"
              eyebrow="Experience · 2023 — present"
              title="Roles, internships, and what came out of them."
              subtitle="A chronological record of where I've worked, what I built, and what I learned."
              alignment="left"
            />

            <ol className="relative" aria-label="Work history">
              <div
                className="absolute left-0 top-2 bottom-2 w-px bg-white/[0.08]"
                aria-hidden="true"
              />
              <div className="space-y-16">
                {sorted.map((exp, index) => (
                  <motion.li
                    id={exp.id}
                    key={exp.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.25) }}
                    className="relative pl-8 md:pl-12 scroll-mt-28 list-none"
                  >
                    <span
                      className="absolute left-0 top-2 -translate-x-[3px] w-[7px] h-[7px] rounded-full bg-primary"
                      aria-hidden="true"
                    />

                    <p className="eyebrow mb-2">
                      <time>{exp.startDate}</time>
                      {' — '}
                      <time>{exp.endDate || 'Present'}</time>
                      {' · '}
                      {exp.location}
                    </p>

                    <h2 className="fluid-h3 text-foreground mb-1">
                      {exp.role || exp.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-5 inline-flex items-center gap-2">
                      <span>{exp.company}</span>
                      {exp.website && (
                        <a
                          href={exp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${exp.company} website (opens in new tab)`}
                          className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                        >
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                    </p>

                    <p className="fluid-body text-muted-foreground leading-[1.75] prose-measure mb-6">
                      {exp.description}
                    </p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-2 prose-measure mb-6">
                        {exp.achievements.map((a, i) => (
                          <li key={i} className="text-sm text-foreground/85 flex gap-3">
                            <span
                              className="text-primary mt-2 h-1 w-1 rounded-full bg-primary shrink-0"
                              aria-hidden="true"
                            />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <ul
                        className="flex flex-wrap gap-1.5"
                        aria-label={`${exp.role || exp.title} stack`}
                      >
                        {exp.technologies.map((t) => (
                          <li
                            key={t}
                            className="px-2.5 py-1 text-[11px] font-mono text-muted-foreground border border-white/[0.06] bg-white/[0.02] rounded-md"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </div>
            </ol>
          </div>
        </main>
      </div>
    </SmoothTransition>
  );
};

export default Experience;
