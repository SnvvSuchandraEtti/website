import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { Project } from '@/data/projects';
import { cn } from '@/lib/utils';
import GradientCover from './GradientCover';
import { ImageWithSkeleton } from './ImageWithSkeleton';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  index?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
  const category = project.category || 'Project';
  const headlineMetric = project.metrics?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.25, 0.1, 0.25, 1] }}
      className="group h-full"
    >
      <Link
        to={`/projects/${project.id}`}
        className={cn(
          'flex flex-col h-full rounded-2xl overflow-hidden bg-card border border-border',
          'transition-colors duration-300 hover:border-foreground/20'
        )}
      >
        {/* Screenshot — large, no overlay text */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted/40">
          {project.imageUrl ? (
              <ImageWithSkeleton
                src={project.imageUrl}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
          ) : (
            <GradientCover title={project.title} color={project.color} />
          )}
          {/* Soft bottom fade for legibility on busy screenshots */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        </div>

        {/* Editorial content block */}
        <div className="flex flex-col flex-1 p-6 lg:p-7">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">{category}</span>
            {project.featured && (
              <span className="eyebrow eyebrow-accent">Featured</span>
            )}
          </div>

          <h3 className="fluid-h3 text-foreground mb-2">
            {project.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">
            {project.description}
          </p>

          {/* One impact line + minimal tech chips */}
          {headlineMetric && (
            <p className="text-sm text-foreground/80 mb-5 font-medium">
              {headlineMetric}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mt-auto pt-5 border-t border-border">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-[11px] font-mono tracking-wide text-muted-foreground bg-muted/40 border border-border rounded-md"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
                +{project.technologies.length - 3}
              </span>
            )}

            <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              <span>Case study</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* External links — small, secondary */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex items-center gap-3 mt-4 -mb-1">
              {project.githubUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`${project.title} on GitHub`}
                >
                  <Github className="h-4 w-4" />
                </button>
              )}
              {project.liveUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Open ${project.title}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
