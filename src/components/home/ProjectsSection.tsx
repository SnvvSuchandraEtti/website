import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/data/projects';

/* ─── Section ─────────────────────────────────────────────────────── */

const ProjectsSection: React.FC = () => {
  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured),
    []
  );

  return (
    <section id="projects" className="section-y relative" aria-label="Selected projects">
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* Header row with inline "All projects" link */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects that shipped, with the numbers to prove it."
            subtitle="A short list of products I've built, shipped, and learned from."
            alignment="left"
            className="mb-0 max-w-2xl"
          />
          <Link
            to="/projects"
            className={cn(
              'self-start md:self-end inline-flex items-center gap-2',
              'text-sm text-foreground whitespace-nowrap',
              'border-b border-border pb-1',
              'transition-colors duration-200 hover:border-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded'
            )}
          >
            All projects
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Project grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
