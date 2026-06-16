import GradientCover from '@/components/ui/GradientCover';
import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import Navbar from '@/components/layout/Navbar';
import { Project, projects } from '@/data/projects';
import { ArrowLeft, Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import SEO from '@/components/seo/SEO';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const project = useMemo<Project | null>(
    () => (id ? projects.find((p) => p.id === id) ?? null : null),
    [id]
  );

  const relatedProjects = useMemo<Project[]>(() => {
    if (!project) return [];
    return projects
      .filter(
        (p) =>
          p.id !== project.id &&
          p.technologies.some((t) => project.technologies.includes(t))
      )
      .slice(0, 2);
  }, [project]);

  // Reset scroll without jank when navigating to a different project.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raf = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
    return () => cancelAnimationFrame(raf);
  }, [id]);

  if (!project) {
    return (
      <PageTransition>
        <SEO
          title="Project not found"
          description="The project you're looking for doesn't exist or has been removed."
          path="/projects"
          noindex
        />
        <Navbar />
        <main className="pt-32 pb-20 min-h-dvh">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-semibold mb-6">Project not found</h1>
            <p className="mb-8 text-muted-foreground">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to projects
            </Link>
          </div>
        </main>
      </PageTransition>
    );
  }

  const headlineMetric = project.metrics?.[0];

  return (
    <PageTransition>
      <SEO
        title={project.title}
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

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-[1100px]">
          {/* Breadcrumb-style back link */}
          <nav aria-label="Breadcrumb" className="mb-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All projects
            </Link>
          </nav>

          {/* Case-study header */}
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mb-14"
          >
            <p className="eyebrow eyebrow-accent mb-5">
              {project.category || 'Project'} · Case study
            </p>
            <h1 className="fluid-h1 text-foreground mb-6">{project.title}</h1>
            <p className="fluid-lead text-muted-foreground prose-measure">
              {project.description}
            </p>
          </motion.header>

          {/* Hero image — full width */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl overflow-hidden border border-white/[0.08] bg-card aspect-[16/9] mb-14"
          >
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={`${project.title} — preview`}
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

          {/* Meta strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-12 mb-14 border-b border-white/[0.08]">
            <MetaItem label="Role" value="Full-stack engineer" />
            <MetaItem label="Stack" value={project.technologies.slice(0, 2).join(', ')} />
            <MetaItem label="Type" value={project.category || 'Application'} />
            {headlineMetric ? (
              <MetaItem label="Impact" value={headlineMetric} />
            ) : (
              <MetaItem label="Status" value={project.featured ? 'Shipped' : 'Active'} />
            )}
          </div>

          {/* Body sections — editorial. Only render sections backed by real data. */}
          <div className="space-y-20 prose-measure">
            {project.longDescription && (
              <Section eyebrow="01" title="Overview">
                <p>{project.longDescription}</p>
              </Section>
            )}

            {project.metrics && project.metrics.length > 0 && (
              <Section eyebrow={project.longDescription ? '02' : '01'} title="Results">
                <ul className="space-y-2.5">
                  {project.metrics.map((m, i) => (
                    <Bullet key={i}>{m}</Bullet>
                  ))}
                </ul>
              </Section>
            )}

            {project.technologies.length > 0 && (
              <Section
                eyebrow={
                  project.longDescription && project.metrics?.length
                    ? '03'
                    : project.longDescription || project.metrics?.length
                    ? '02'
                    : '01'
                }
                title="Stack"
              >
                <ul className="flex flex-wrap gap-2 not-prose">
                  {project.technologies.map((t) => (
                    <li
                      key={t}
                      className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-white/[0.08] text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* External links */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="mt-20 pt-12 border-t border-white/[0.08] flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" /> View live
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-white/[0.12] hover:bg-white/[0.04] transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <Github className="h-4 w-4" aria-hidden="true" /> Source
                </a>
              )}
            </div>
          )}

          {/* Related */}
          {relatedProjects.length > 0 && (
            <div className="mt-24 pt-12 border-t border-white/[0.08]">
              <p className="eyebrow eyebrow-accent mb-6">Related work</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProjects.map((r) => (
                  <Link
                    key={r.id}
                    to={`/projects/${r.id}`}
                    className="group flex items-start gap-5 p-6 rounded-2xl border border-white/[0.06] hover:border-white/[0.14] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-white/[0.06]">
                      {r.imageUrl ? (
                        <img src={r.imageUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <GradientCover title={r.title} color={r.color} compact />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="eyebrow mb-1.5">{r.category || 'Project'}</p>
                      <h3 className="text-foreground font-medium mb-1 group-hover:text-primary transition-colors flex items-center gap-2 text-base">
                        {r.title}
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
};

const MetaItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="eyebrow mb-1.5">{label}</p>
    <p className="text-sm text-foreground">{value}</p>
  </div>
);

const Section: React.FC<{ eyebrow: string; title: string; children: React.ReactNode }> = ({
  eyebrow,
  title,
  children,
}) => (
  <section>
    <p className="eyebrow eyebrow-accent mb-3">{eyebrow}</p>
    <h2 className="fluid-h2 text-foreground mb-6">{title}</h2>
    <div className="fluid-body text-muted-foreground leading-[1.75] space-y-4">{children}</div>
  </section>
);

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex gap-3 text-foreground/85">
    <span className="text-primary mt-2.5 h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
    <span>{children}</span>
  </li>
);

export default ProjectDetail;
