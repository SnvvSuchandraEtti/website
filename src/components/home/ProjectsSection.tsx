import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/data/projects';

const ProjectsSection: React.FC = () => {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="section-y relative">
      <div className="container mx-auto px-4 max-w-[1200px]">
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
            className="self-start md:self-end inline-flex items-center gap-2 text-sm text-foreground border-b border-white/[0.15] pb-1 hover:border-foreground transition-colors whitespace-nowrap"
          >
            All projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

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
