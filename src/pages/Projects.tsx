import React, { useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '@/data/projects';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionHeading from '@/components/ui/SectionHeading';
import PageTransition from '@/components/ui/PageTransition';
import SEO from '@/components/seo/SEO';

const filterOptions: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'Flutter', label: 'Flutter' },
  { id: 'Web', label: 'Web' },
  { id: 'AI', label: 'AI' },
  { id: 'Backend', label: 'Backend' },
];

const matchesCategory = (p: Project, category: string) => {
  if (category === 'all') return true;
  const c = category.toLowerCase();
  if (p.category && p.category.toLowerCase() === c) return true;
  return p.technologies.some((t) => t.toLowerCase() === c);
};

const Projects: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const tablistRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => projects.filter((p) => matchesCategory(p, category)),
    [category]
  );

  // Keyboard navigation for accessible tabs
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const idx = filterOptions.findIndex((o) => o.id === category);
      let next = idx;
      if (e.key === 'ArrowRight') next = (idx + 1) % filterOptions.length;
      else if (e.key === 'ArrowLeft') next = (idx - 1 + filterOptions.length) % filterOptions.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = filterOptions.length - 1;
      
      const id = filterOptions[next].id;
      setCategory(id);
      
      // Focus management
      const btn = tablistRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${id}"]`);
      btn?.focus();
    },
    [category]
  );

  return (
    <PageTransition>
      <div className="min-h-dvh flex flex-col">
        <SEO
          title="Projects"
          description="Portfolio projects by Suchandra Etti — EdTech, marketplace, AI, and mobile apps with real-world impact metrics."
          path="/projects"
        />
        <Navbar />

        <main className="flex-grow pt-28 pb-24">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <SectionHeading
              as="h1"
              eyebrow="Work · 2022 — present"
              title="Selected projects."
              subtitle="Apps and tools I've shipped, ranging from edtech serving thousands to AI experiments and marketplace prototypes."
              alignment="left"
            />

            {/* Filter row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div
                ref={tablistRef}
                role="tablist"
                aria-label="Filter projects by category"
                onKeyDown={handleTabKeyDown}
                className="flex flex-wrap items-center gap-2"
              >
                {filterOptions.map((opt) => {
                  const selected = category === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="tab"
                      data-tab-id={opt.id}
                      aria-selected={selected}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setCategory(opt.id)}
                      className={cn(
                        'px-5 h-11 rounded-full text-[13px] font-medium transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        selected
                          ? 'bg-foreground text-background shadow-[0_1px_2px_rgba(255,255,255,0.1)]'
                          : 'bg-muted/30 text-muted-foreground border border-border/[0.08] hover:text-foreground hover:bg-muted/40 hover:border-border/[0.12]'
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[13px] font-medium text-muted-foreground/80" aria-live="polite">
                Showing {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
              </p>
            </div>

            {/* Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.15) }}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <p className="text-[15px] text-muted-foreground mb-6">No projects in this category yet.</p>
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-muted/40 border border-border/[0.08] text-[14px] font-medium text-foreground hover:bg-muted/60 hover:border-border/[0.15] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Show all projects
                </button>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Projects;
