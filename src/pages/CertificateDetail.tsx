import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Download,
  Maximize2,
  ShieldCheck,
  Tag,
  Hash,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { certificates, Certificate } from '@/data/certificates';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/ui/PageTransition';
import AdaptivePdfViewer from '@/components/certificates/AdaptivePdfViewer';
import { CertificateViewer } from '@/components/certificates/CertificateFullViewer';
import SEO from '@/components/seo/SEO';
import { getIssuerStyle } from '@/utils/issuerStyle';

/* ─── Helpers ─────────────────────────────────────────────────────── */

const formatDate = (s: string) => {
  if (!s) return '';
  if (/ongoing|present/i.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(d);
};

const toIsoDate = (s: string) => {
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
};

/* ─── Sub-components ──────────────────────────────────────────────── */

/** Data row for certificate metadata (date, ID, category) */
const MetaRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}> = ({ icon, label, children }) => (
  <div className="flex items-start gap-3 py-2">
    <span className="text-muted-foreground/60 mt-0.5">{icon}</span>
    <div className="min-w-0">
      <dt className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 mb-0.5">
        {label}
      </dt>
      <dd className="text-[13px] text-foreground font-medium">{children}</dd>
    </div>
  </div>
);

/** Action button specialized for certificate actions */
const ActionButton: React.FC<{
  onClick?: () => void;
  href?: string;
  download?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  icon: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}> = ({ onClick, href, download, disabled, variant = 'secondary', icon, children, fullWidth }) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    variant === 'primary'
      ? 'bg-foreground text-background hover:bg-foreground/90 shadow-[0_1px_2px_rgba(255,255,255,0.1)]'
      : 'bg-muted/40 border border-border text-foreground hover:bg-muted/60 hover:border-foreground/15'
  );

  const content = (
    <>
      <span className={cn(variant === 'secondary' ? 'text-muted-foreground' : '')}>{icon}</span>
      {children}
    </>
  );

  if (href) {
    if (disabled) {
      return <span className={baseClasses}>{content}</span>;
    }
    return (
      <a
        href={href}
        download={download}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={baseClasses}>
      {content}
    </button>
  );
};

/** Skill chip */
const SkillChip: React.FC<{ skill: string }> = ({ skill }) => (
  <li
    className={cn(
      'px-2.5 py-1 text-[11px] font-mono text-muted-foreground/90',
      'border border-border bg-muted/30 rounded-md',
      'transition-colors hover:border-foreground/20 hover:text-foreground'
    )}
  >
    {skill}
  </li>
);

/* ─── Page ────────────────────────────────────────────────────────── */

const CertificateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [fullScreen, setFullScreen] = useState(false);

  // Memoize active certificate
  const certificate = useMemo<Certificate | null>(
    () => (id ? certificates.find((c) => c.id === id) ?? null : null),
    [id]
  );

  // Find up to 3 related certificates
  const related = useMemo<Certificate[]>(() => {
    if (!certificate) return [];
    return certificates
      .filter((c) => c.category === certificate.category && c.id !== certificate.id)
      .slice(0, 3);
  }, [certificate]);

  // Handle scroll restoration smoothly
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raf = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
    return () => cancelAnimationFrame(raf);
  }, [id]);

  // Body-scroll lock for fullscreen viewer
  useEffect(() => {
    if (!fullScreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [fullScreen]);

  // 404 Fallback
  if (!certificate) {
    return (
      <PageTransition>
        <SEO
          title="Certificate not found"
          description="The credential you're looking for doesn't exist."
          path="/certificates"
          noindex
        />
        <Navbar />
        <main className="min-h-dvh flex flex-col items-center justify-center pt-24 pb-20">
          <div className="container mx-auto px-4 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-6" />
            <h1 className="fluid-h3 text-foreground mb-3">Credential missing</h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              This certificate either doesn't exist, has been removed, or the URL is incorrect.
            </p>
            <Link
              to="/certificates"
              className={cn(
                'inline-flex items-center gap-2 h-10 px-6 rounded-full text-sm font-medium',
                'bg-foreground text-background hover:bg-foreground/90 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
              )}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Browse all certificates
            </Link>
          </div>
        </main>
      </PageTransition>
    );
  }

  const verified = !!(certificate.credentialUrl && certificate.credentialUrl !== '#');
  const issuerStyle = getIssuerStyle(certificate.issuer, certificate.title);
  const isoDate = toIsoDate(certificate.date);
  const hasPdf = !!certificate.pdfUrl;

  return (
    <PageTransition>
      <SEO
        title={certificate.title}
        description={`${certificate.title} — issued by ${certificate.issuer} (${certificate.date}). ${certificate.description}`}
        path={`/certificates/${certificate.id}`}
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'EducationalOccupationalCredential',
          name: certificate.title,
          credentialCategory: certificate.category,
          recognizedBy: { '@type': 'Organization', name: certificate.issuer },
          dateCreated: isoDate || certificate.date,
          description: certificate.description,
        }}
      />
      <Navbar />

      <main className="min-h-dvh pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-[1200px]">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <Link
              to="/certificates"
              className={cn(
                'inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground',
                'hover:text-foreground transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm'
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All certificates
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">
            {/* ── Metadata Column ─────────────────────────────────── */}
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:sticky lg:top-32 lg:self-start flex flex-col gap-8"
              aria-label="Certificate details"
            >
              {/* Header block */}
              <div>
                <p className="eyebrow mb-3" style={{ color: issuerStyle.hex }}>
                  {certificate.issuer}
                </p>
                <h1 className="fluid-h2 text-foreground font-semibold leading-[1.1] tracking-tight mb-4">
                  {certificate.title}
                </h1>
                {verified && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified credential
                  </span>
                )}
              </div>

              {/* Data list */}
              <dl
                className="grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-1 py-6 border-y border-border"
                aria-label="Metadata"
              >
                <MetaRow icon={<Calendar className="h-3.5 w-3.5" />} label="Issued">
                  <time dateTime={isoDate}>{formatDate(certificate.date)}</time>
                </MetaRow>
                <MetaRow icon={<Tag className="h-3.5 w-3.5" />} label="Category">
                  <span className="capitalize">{certificate.category}</span>
                </MetaRow>
                {certificate.credentialId && (
                  <MetaRow icon={<Hash className="h-3 w-3" />} label="Credential ID">
                    <span className="font-mono text-xs text-foreground/80 break-all select-all">
                      {certificate.credentialId}
                    </span>
                  </MetaRow>
                )}
              </dl>

              {/* Description */}
              <div className="prose-measure-tight">
                <h2 className="eyebrow text-foreground/80 mb-3">About</h2>
                <p className="text-sm text-muted-foreground leading-[1.6]">
                  {certificate.description}
                </p>
              </div>

              {/* Skills covered */}
              {certificate.skills && certificate.skills.length > 0 && (
                <div>
                  <h2 className="eyebrow text-foreground/80 mb-3">Skills</h2>
                  <ul className="flex flex-wrap gap-2" aria-label="Skills covered">
                    {certificate.skills.map((s) => (
                      <SkillChip key={s} skill={s} />
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <ActionButton
                  onClick={() => setFullScreen(true)}
                  disabled={!hasPdf}
                  variant="primary"
                  icon={<Maximize2 className="h-4 w-4" aria-hidden="true" />}
                  fullWidth
                >
                  View full certificate
                </ActionButton>

                <div className="grid grid-cols-2 gap-3">
                  <ActionButton
                    href={hasPdf ? certificate.pdfUrl : undefined}
                    download={hasPdf ? `${certificate.title}.pdf` : undefined}
                    disabled={!hasPdf}
                    icon={<Download className="h-4 w-4" aria-hidden="true" />}
                    fullWidth
                  >
                    Download
                  </ActionButton>

                  <ActionButton
                    href={verified ? certificate.credentialUrl : undefined}
                    disabled={!verified}
                    icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
                    fullWidth
                  >
                    Verify
                  </ActionButton>
                </div>
              </div>
            </motion.aside>

            {/* ── Document Column ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:pt-2" // Optical alignment with title
            >
              <div className="rounded-xl overflow-hidden border border-border bg-card/50 ring-1 ring-border/20 shadow-2xl">
                <AdaptivePdfViewer
                  pdfUrl={certificate.pdfUrl}
                  title={certificate.title}
                  orientationHint={certificate.orientation}
                />
              </div>
            </motion.div>
          </div>

          {/* ── Related Certificates ──────────────────────────────── */}
          {related.length > 0 && (
            <motion.section
              aria-labelledby="related-heading"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="mt-32 pt-16 border-t border-border"
            >
              <h2 id="related-heading" className="eyebrow mb-6">
                More in {certificate.category}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/certificates/${c.id}`}
                      className={cn(
                        'group flex flex-col justify-between h-full p-5 rounded-xl',
                        'bg-muted/30 border border-border/40',
                        'transition-all duration-300',
                        'hover:bg-muted/40 hover:border-border hover:shadow-lg',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                      )}
                    >
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <p className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground/80 transition-colors">
                            {c.issuer}
                          </p>
                          <ArrowUpRight
                            className="h-3.5 w-3.5 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-foreground/90 group-hover:text-foreground leading-tight">
                          {c.title}
                        </h3>
                      </div>
                      <time className="text-[11px] font-mono text-muted-foreground/60">
                        {formatDate(c.date)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>
      </main>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {fullScreen && (
          <CertificateViewer
            pdfUrl={certificate.pdfUrl}
            title={certificate.title}
            onClose={() => setFullScreen(false)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default CertificateDetail;
