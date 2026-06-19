import React, { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { skills, Skill } from '@/data/skills';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import PageTransition from '@/components/ui/PageTransition';
import SEO from '@/components/seo/SEO';
import { getSkillIconUrl, FALLBACK_SKILL_ICON } from '@/lib/skillIcons';
import { ImageWithSkeleton } from '@/components/ui/ImageWithSkeleton';

// Most-used first
const CATEGORY_ORDER: Skill['category'][] = [
  'Programming',
  'Framework',
  'Database',
  'Cloud',
  'Tools',
  'Development',
  'Design',
  'CS Fundamentals',
];

const PROFICIENCY_LABEL: Record<number, string> = {
  1: 'Familiar',
  2: 'Working knowledge',
  3: 'Proficient',
  4: 'Advanced',
  5: 'Expert',
};

const Skills: React.FC = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const { grouped, categories } = useMemo(() => {
    const g = skills.reduce((acc, skill) => {
      (acc[skill.category] ||= []).push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
    
    // Sort by proficiency desc, then name asc
    Object.values(g).forEach((list) =>
      list.sort((a, b) => b.proficiency - a.proficiency || a.name.localeCompare(b.name))
    );
    
    const ordered: Skill['category'][] = [
      ...CATEGORY_ORDER.filter((c) => g[c]?.length),
      ...(Object.keys(g) as Skill['category'][]).filter((c) => !CATEGORY_ORDER.includes(c)),
    ];
    
    return { grouped: g, categories: ordered };
  }, []);

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
          title="Skills"
          description="Suchandra's tech stack: Flutter, React, React Native, Node.js, Python, Firebase, MongoDB, AWS, and CS fundamentals."
          path="/skills"
        />
        <Navbar />

        <main className="flex-grow pt-28 pb-24">
          <div className="container mx-auto px-4 max-w-[1100px]">
            <SectionHeading
              as="h1"
              eyebrow="Capabilities"
              title="Tools & technologies."
              subtitle="Grouped by category and ordered by how often I reach for them. Every tool listed here is one I've used in production or deep learning environments."
              alignment="left"
            />

            <div className="space-y-24 mt-16">
              {categories.map((cat, idx) => (
                <motion.section
                  key={cat}
                  aria-labelledby={`skills-${cat}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.2) }}
                >
                  <div className="flex items-end justify-between mb-8 pb-4 border-b border-border/[0.06]">
                    <h2 id={`skills-${cat}`} className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                      {cat}
                    </h2>
                    <span className="text-[13px] font-mono text-muted-foreground/60 mb-1">
                      {grouped[cat].length}
                    </span>
                  </div>

                  <ul
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-8"
                    aria-label={`${cat} skills`}
                  >
                    {grouped[cat].map((s) => (
                      <li
                        key={s.id}
                        id={s.id}
                        className="flex items-center gap-4 group scroll-mt-32"
                      >
                        <div className="w-10 h-10 rounded-lg border border-border/[0.08] bg-muted/30 p-2 shrink-0 flex items-center justify-center transition-colors group-hover:border-border/[0.15] group-hover:bg-muted/40">
                          <ImageWithSkeleton
                            src={getSkillIconUrl(s.id)}
                            alt=""
                            width={24}
                            height={24}
                            loading="lazy"
                            decoding="async"
                            className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100"
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img.src !== FALLBACK_SKILL_ICON) img.src = FALLBACK_SKILL_ICON;
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium text-foreground/90 group-hover:text-foreground transition-colors truncate">
                            {s.name}
                          </p>
                          <p
                            className="text-[11px] font-mono tracking-widest text-muted-foreground/50 mt-1"
                            aria-label={`Proficiency: ${PROFICIENCY_LABEL[s.proficiency] ?? s.proficiency} (${s.proficiency} of 5)`}
                          >
                            <span aria-hidden="true" className="flex gap-[2px]">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  className={cn(
                                    "h-1 rounded-full flex-1 transition-colors duration-300",
                                    i < s.proficiency 
                                      ? "bg-primary/60 group-hover:bg-primary" 
                                      : "bg-muted/50 group-hover:bg-muted/70"
                                  )}
                                />
                              ))}
                            </span>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Skills;
