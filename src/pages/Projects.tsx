import React, { useMemo, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { projects, Project } from '@/data/projects';
import Navbar from '@/components/layout/Navbar';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionHeading from '@/components/ui/SectionHeading';
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
  // Exact-token match on technologies to avoid false positives like "Web" → "Webpack".
  return p.technologies.some((t) => t.toLowerCase() === c);
};

const Projects: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const tablistRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => projects.filter((p) => matchesCategory(p, category)),
    [category]
  );

  // Arrow-key navigation within the filter tablist.
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      const idx = filterOptions.findIndex((o) => o.id === category);
      let next = idx;
      if (e.key === 'ArrowRight') next = (idx + 1) % filterOptions.length;
      else if (e.key === 'ArrowLeft') next = (idx - 1 + filterOptions.length) % filterOptions.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = filterOptions.length - 1;
      const id = filterOptions[next].id;
      setCategory(id);
      const btn = tablistRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${id}"]`);
      btn?.focus();
    },
    [category]
  );

  return (
    <div className="min-h-dvh flex flex-col">
      <SEO
        title="Projects"
        description="Portfolio projects by Suchandra Etti — EdTech, marketplace, AI, and mobile apps with real-world impact metrics."
        path="/projects"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Projects by Suchandra Etti',
          itemListElement: projects.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'CreativeWork',
              name: p.title,
              description: p.description,
              url: `https://suchandra369.lovable.app/projects/${p.id}`,
              image: p.imageUrl,
              keywords: p.technologies.join(', '),
              author: { '@type': 'Person', name: 'Suchandra Etti' },
            },
          })),
        }}
      />
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <SectionHeading
            as="h1"
            eyebrow="Work · 2022 — present"
            title="Selected projects."
            subtitle="Apps and tools I've shipped, ranging from edtech serving thousands to AI experiments and marketplace prototypes."
            alignment="left"
          />

          {/* Filter row — accessible tablist */}
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Filter projects by category"
            onKeyDown={handleTabKeyDown}
            className="flex flex-wrap items-center gap-1.5 mb-12"
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
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    selected
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground border border-white/[0.08] hover:text-foreground hover:border-white/[0.16]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
            <span className="ml-auto text-xs text-muted-foreground" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            </span>
          </div>

          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-6">No projects in this category yet.</p>
              <button
                type="button"
                onClick={() => setCategory('all')}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/[0.12] text-sm text-foreground hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Show all projects
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
