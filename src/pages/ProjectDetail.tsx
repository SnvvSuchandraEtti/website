import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, ArrowUpRight, AlertCircle, LayoutTemplate, Briefcase, Code2, Users } from 'lucide-react';

import { Project, projects } from '@/data/projects';
import { cn } from '@/lib/utils';
import GradientCover from '@/components/ui/GradientCover';
import PageTransition from '@/components/ui/PageTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/seo/SEO';

/* ─── Sub-components ──────────────────────────────────────────────── */

const MetaItem: React.FC<{ 
  icon?: React.ReactNode; 
  label: string; 
  value: React.ReactNode 
}> = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1.5">
    <dt className="eyebrow flex items-center gap-2 text-muted-foreground/70">
      {icon && <span className="opacity-70">{icon}</span>}
      {label}
    </dt>
    <dd className="text-sm font-medium text-foreground">{value}</dd>
  </div>
);

const Section: React.FC<{ 
  eyebrow: string; 
  title: string; 
  children: React.ReactNode 
}> = ({ eyebrow, title, children }) => (
  <section className="scroll-mt-32">
    <div className="flex items-baseline gap-4 mb-5 border-b border-border/[0.04] pb-4">
      <span className="font-mono text-sm text-primary/60">{eyebrow}</span>
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">{title}</h2>
    </div>
    <div className="prose-measure text-[15px] leading-[1.75] text-muted-foreground/90 space-y-5">
      {children}
    </div>
  </section>
);

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="relative pl-6 text-[15px] leading-relaxed text-muted-foreground">
    <span 
      className="absolute left-0 top-[0.6rem] h-1.5 w-1.5 rounded-full bg-primary/60 ring-4 ring-primary/10" 
      aria-hidden="true" 
    />
    {children}
  </li>
);

const ActionButton: React.FC<{
  href: string;
  variant?: 'primary' | 'secondary';
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ href, variant = 'secondary', icon, children }) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg text-[14px] font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    variant === 'primary'
      ? 'bg-foreground text-background hover:bg-foreground/90 shadow-[0_1px_2px_rgba(255,255,255,0.1)]'
      : 'bg-white/[0.03] border border-border/[0.08] text-foreground hover:bg-white/[0.06] hover:border-border/[0.12]'
  );

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
      <span className={cn(variant === 'secondary' ? 'text-muted-foreground' : '')}>{icon}</span>
      {children}
    </a>
  );
};

/* ─── Page ────────────────────────────────────────────────────────── */

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const project = useMemo<Project | null>(
    () => (id ? projects.find((p) => p.id === id) ?? null : null),
    [id]
  );

  const relatedProjects = useMemo<Project[]>(() => {
    if (!project) return [];
    return projects
      .filter((p) => p.id !== project.id && p.technologies.some((t) => project.technologies.includes(t)))
      .slice(0, 2);
  }, [project]);

  // Reset scroll smoothly on route change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raf = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
    return () => cancelAnimationFrame(raf);
  }, [id]);

  // 404 Fallback
  if (!project) {
    return (
      <PageTransition>
        <div className="min-h-dvh flex flex-col">
          <SEO
            title="Project not found"
            description="The project you're looking for doesn't exist."
            path="/projects"
            noindex
          />
          <Navbar />
          <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-20">
            <div className="container mx-auto px-4 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-6" />
              <h1 className="fluid-h3 text-foreground mb-3">Project missing</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                This case study either doesn't exist, has been removed, or the URL is incorrect.
              </p>
              <Link
                to="/projects"
                className={cn(
                  'inline-flex items-center gap-2 h-10 px-6 rounded-full text-sm font-medium',
                  'bg-foreground text-background hover:bg-foreground/90 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                )}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Browse all projects
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const headlineMetric = project.metrics?.[0];

  return (
    <PageTransition>
      <div className="min-h-dvh flex flex-col">
        <SEO
          title={`${project.title} — Case Study`}
          description={project.description}
          path={`/projects/${project.id}`}
          ogType="article"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.description,
            keywords: project.technologies.join(', '),
            author: { '@type': 'Person', name: 'Suchandra Etti' },
            url: project.liveUrl,
            codeRepository: project.githubUrl,
          }}
        />
        <Navbar />

        <main className="flex-grow pt-28 pb-24">
          <div className="container mx-auto px-4 max-w-[1000px]">
            
            {/* ── Breadcrumb ────────────────────────────────────────── */}
            <nav aria-label="Breadcrumb" className="mb-10">
              <Link
                to="/projects"
                className={cn(
                  'inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground',
                  'hover:text-foreground transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm'
                )}
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                All projects
              </Link>
            </nav>

            {/* ── Header ────────────────────────────────────────────── */}
            <motion.header
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mb-12"
            >
              <div className="flex items-center gap-3 mb-5">
                <p className="eyebrow eyebrow-accent">{project.category || 'Project'}</p>
                <span className="w-1 h-1 rounded-full bg-white/[0.15]" aria-hidden="true" />
                <p className="eyebrow text-muted-foreground">Case study</p>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                {project.title}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed prose-measure">
                {project.description}
              </p>
            </motion.header>

            {/* ── Hero Image ────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl overflow-hidden border border-border/[0.08] bg-card/50 ring-1 ring-white/[0.02] shadow-2xl aspect-[16/9] md:aspect-[21/9] mb-14"
            >
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={`${project.title} interface preview`}
                  width={1600}
                  height={900}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <GradientCover title={project.title} tags={project.technologies} color={project.color} />
              )}
            </motion.div>

            {/* ── Meta Strip ────────────────────────────────────────── */}
            <dl 
              className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 pb-12 mb-16 border-b border-border/[0.06]"
              aria-label="Project details"
            >
              <MetaItem 
                icon={<Briefcase className="w-3.5 h-3.5" />} 
                label="Role" 
                value="Lead Engineer" 
              />
              <MetaItem 
                icon={<Code2 className="w-3.5 h-3.5" />} 
                label="Core Stack" 
                value={project.technologies.slice(0, 2).join(', ')} 
              />
              <MetaItem 
                icon={<LayoutTemplate className="w-3.5 h-3.5" />} 
                label="Platform" 
                value={project.category || 'Application'} 
              />
              <MetaItem 
                icon={<Users className="w-3.5 h-3.5" />} 
                label={headlineMetric ? 'Impact' : 'Status'} 
                value={headlineMetric || (project.featured ? 'Shipped in Prod' : 'Active Development')} 
              />
            </dl>

            {/* ── Editorial Body ────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 lg:gap-24">
              
              {/* Main Content */}
              <div className="space-y-16">
                {project.longDescription && (
                  <Section eyebrow="01" title="Overview">
                    <p>{project.longDescription}</p>
                  </Section>
                )}

                {project.metrics && project.metrics.length > 0 && (
                  <Section eyebrow={project.longDescription ? '02' : '01'} title="Results & Impact">
                    <ul className="space-y-4">
                      {project.metrics.map((m, i) => (
                        <Bullet key={i}>{m}</Bullet>
                      ))}
                    </ul>
                  </Section>
                )}
              </div>

              {/* Sidebar / Stack */}
              <aside className="space-y-10 lg:sticky lg:top-32 lg:self-start">
                {project.technologies.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-foreground mb-4">Technologies used</h2>
                    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                      {project.technologies.map((t) => (
                        <li
                          key={t}
                          className="px-2.5 py-1 text-[12px] font-mono text-muted-foreground/90 border border-border/[0.08] bg-white/[0.02] rounded-md transition-colors hover:border-border/[0.15] hover:text-foreground"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                {(project.githubUrl || project.liveUrl) && (
                  <div className="flex flex-col gap-3 pt-6 border-t border-border/[0.06]">
                    {project.liveUrl && (
                      <ActionButton
                        href={project.liveUrl}
                        variant="primary"
                        icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
                      >
                        Visit live site
                      </ActionButton>
                    )}
                    {project.githubUrl && (
                      <ActionButton
                        href={project.githubUrl}
                        variant="secondary"
                        icon={<Github className="h-4 w-4" aria-hidden="true" />}
                      >
                        View source code
                      </ActionButton>
                    )}
                  </div>
                )}
              </aside>

            </div>

            {/* ── Related Projects ──────────────────────────────────── */}
            {relatedProjects.length > 0 && (
              <motion.section 
                aria-labelledby="related-heading"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="mt-32 pt-16 border-t border-border/[0.06]"
              >
                <h2 id="related-heading" className="eyebrow eyebrow-accent mb-8">
                  Related work
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedProjects.map((r) => (
                    <li key={r.id}>
                      <Link
                        to={`/projects/${r.id}`}
                        className={cn(
                          'group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl',
                          'bg-white/[0.04] border border-border/[0.04]',
                          'transition-all duration-300',
                          'hover:bg-white/[0.04] hover:border-border/[0.1] hover:shadow-lg',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                        )}
                      >
                        <div className="w-full sm:w-24 h-48 sm:h-24 shrink-0 rounded-xl overflow-hidden border border-border/[0.06]">
                          {r.imageUrl ? (
                            <img src={r.imageUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                          ) : (
                            <GradientCover title={r.title} color={r.color} compact />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <p className="text-[11px] font-mono text-muted-foreground mb-2">
                            {r.category || 'Project'}
                          </p>
                          <h3 className="text-[15px] font-medium text-foreground/90 group-hover:text-foreground mb-1.5 transition-colors flex items-center gap-2">
                            {r.title}
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                          </h3>
                          <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {r.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProjectDetail;
