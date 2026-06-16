import React, { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { skills, Skill } from '@/data/skills';
import Navbar from '@/components/layout/Navbar';
import SectionHeading from '@/components/ui/SectionHeading';
import SmoothTransition from '@/components/ui/SmoothTransition';
import SEO from '@/components/seo/SEO';
import { getSkillIconUrl, FALLBACK_SKILL_ICON } from '@/lib/skillIcons';

// Curated category order — most-used first, instead of alphabetical noise.
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
    // Sort by proficiency desc, then name asc within each category.
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
    <SmoothTransition>
      <div className="min-h-dvh flex flex-col">
        <SEO
          title="Skills"
          description="Suchandra's tech stack: Flutter, React, React Native, Node.js, Python, Firebase, MongoDB, AWS, and CS fundamentals."
          path="/skills"
        />
        <Navbar />

        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-[1100px]">
            <SectionHeading
              as="h1"
              eyebrow="Capabilities"
              title="Tools and technologies I work with."
              subtitle="Grouped by category and ordered by how often I reach for them. Every name here is one I've shipped production code with."
              alignment="left"
            />

            <div className="space-y-20">
              {categories.map((cat, idx) => (
                <motion.section
                  key={cat}
                  aria-labelledby={`skills-${cat}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.2) }}
                >
                  <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-white/[0.08]">
                    <h2 id={`skills-${cat}`} className="fluid-h3 text-foreground">
                      {cat}
                    </h2>
                    <span className="eyebrow">
                      {grouped[cat].length} {grouped[cat].length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <ul
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-6"
                    aria-label={`${cat} skills`}
                  >
                    {grouped[cat].map((s) => (
                      <li
                        key={s.id}
                        id={s.id}
                        className="flex items-center gap-3 group scroll-mt-28"
                      >
                        <div className="w-9 h-9 rounded-md border border-white/[0.06] bg-white/[0.02] p-1.5 shrink-0 flex items-center justify-center">
                          <img
                            src={getSkillIconUrl(s.id)}
                            alt=""
                            width={24}
                            height={24}
                            loading="lazy"
                            decoding="async"
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img.src !== FALLBACK_SKILL_ICON) img.src = FALLBACK_SKILL_ICON;
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {s.name}
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            aria-label={`Proficiency: ${PROFICIENCY_LABEL[s.proficiency] ?? s.proficiency} (${s.proficiency} of 5)`}
                          >
                            <span aria-hidden="true">
                              {'●'.repeat(s.proficiency)}
                              <span className="opacity-30">{'●'.repeat(5 - s.proficiency)}</span>
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
      </div>
    </SmoothTransition>
  );
};

export default Skills;
