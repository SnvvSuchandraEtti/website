import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Download,
  Maximize2,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { certificates, Certificate } from '@/data/certificates';
import Navbar from '@/components/layout/Navbar';
import AdaptivePdfViewer from '@/components/certificates/AdaptivePdfViewer';
import { CertificateViewer } from '@/components/certificates/CertificateFullViewer';
import { Button } from '@/components/ui/button';
import SEO from '@/components/seo/SEO';
import { getIssuerStyle } from '@/utils/issuerStyle';

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

const CertificateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [fullScreen, setFullScreen] = useState(false);

  const certificate = useMemo<Certificate | null>(
    () => (id ? certificates.find((c) => c.id === id) ?? null : null),
    [id]
  );

  const related = useMemo<Certificate[]>(() => {
    if (!certificate) return [];
    return certificates
      .filter((c) => c.category === certificate.category && c.id !== certificate.id)
      .slice(0, 5);
  }, [certificate]);

  // Reset scroll on navigation without smooth jank.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raf = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
    return () => cancelAnimationFrame(raf);
  }, [id]);

  // Body-scroll lock while viewer is open.
  useEffect(() => {
    if (!fullScreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [fullScreen]);

  if (!certificate) {
    return (
      <>
        <SEO
          title="Certificate not found"
          description="The certificate you're looking for doesn't exist or has been removed."
          path="/certificates"
          noindex
        />
        <Navbar />
        <main className="min-h-dvh pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="fluid-h3 text-foreground mb-4">Certificate not found</h1>
            <p className="text-muted-foreground mb-8">
              This credential doesn't exist or has been removed.
            </p>
            <Link
              to="/certificates"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All certificates
            </Link>
          </div>
        </main>
      </>
    );
  }

  const verified = !!(certificate.credentialUrl && certificate.credentialUrl !== '#');
  const issuerStyle = getIssuerStyle(certificate.issuer, certificate.title);
  const isoDate = toIsoDate(certificate.date);
  const hasPdf = !!certificate.pdfUrl;

  return (
    <>
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
          dateCreated: certificate.date,
          description: certificate.description,
        }}
      />
      <Navbar />
      <main className="min-h-dvh pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-[1200px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              to="/certificates"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> All certificates
            </Link>
          </nav>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-10">
            {/* Metadata column */}
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <p className="eyebrow mb-3" style={{ color: issuerStyle.hex }}>
                {certificate.issuer}
              </p>
              <h1 className="fluid-h2 text-foreground font-semibold leading-tight mb-5">
                {certificate.title}
              </h1>

              {verified && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 mb-5">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified credential
                </span>
              )}

              <dl className="space-y-4 pb-6 mb-6 border-b border-white/[0.08]">
                <Row icon={<Calendar className="h-3.5 w-3.5" aria-hidden="true" />} label="Issued">
                  <time dateTime={isoDate}>{formatDate(certificate.date)}</time>
                </Row>
                <Row icon={<Tag className="h-3.5 w-3.5" aria-hidden="true" />} label="Category">
                  <span className="capitalize">{certificate.category}</span>
                </Row>
                {certificate.credentialId && (
                  <Row
                    icon={<span className="font-mono text-[10px]" aria-hidden="true">#</span>}
                    label="Credential ID"
                  >
                    <span className="font-mono text-xs break-all">{certificate.credentialId}</span>
                  </Row>
                )}
              </dl>

              <div className="mb-6">
                <h2 className="eyebrow mb-2">About</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {certificate.description}
                </p>
              </div>

              {certificate.skills && certificate.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="eyebrow mb-2">Skills</h2>
                  <ul className="flex flex-wrap gap-1.5" aria-label="Skills covered">
                    {certificate.skills.map((s) => (
                      <li
                        key={s}
                        className="px-2.5 py-1 text-[11px] font-mono text-muted-foreground border border-white/[0.08] rounded"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setFullScreen(true)}
                  disabled={!hasPdf}
                  aria-label="Open certificate in full screen"
                  className="w-full"
                >
                  <Maximize2 className="w-4 h-4 mr-2" aria-hidden="true" />
                  View full certificate
                </Button>
                <div className="flex gap-2">
                  {hasPdf ? (
                    <Button variant="outline" asChild className="flex-1">
                      <a
                        href={certificate.pdfUrl}
                        download={`${certificate.title}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                        Download
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="flex-1">
                      <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                      Download
                    </Button>
                  )}
                  {verified && (
                    <Button variant="outline" asChild className="flex-1">
                      <a
                        href={certificate.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Verify credential on issuer site (opens in new tab)"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                        Verify
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.aside>

            {/* PDF column */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <AdaptivePdfViewer
                pdfUrl={certificate.pdfUrl}
                title={certificate.title}
                orientationHint={certificate.orientation}
              />
            </motion.div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <motion.section
              aria-labelledby="related-heading"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="mt-20 pt-10 border-t border-white/[0.08]"
            >
              <h2 id="related-heading" className="eyebrow mb-5">
                More {certificate.category} certificates
              </h2>
              <ul className="divide-y divide-white/[0.06]">
                {related.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/certificates/${c.id}`}
                      className="flex items-center justify-between gap-4 py-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {c.title}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          {c.issuer} · {formatDate(c.date)}
                        </p>
                      </div>
                      <ArrowUpRight
                        className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>
      </main>

      {fullScreen && (
        <CertificateViewer
          pdfUrl={certificate.pdfUrl}
          title={certificate.title}
          onClose={() => setFullScreen(false)}
        />
      )}
    </>
  );
};

const Row: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({
  icon,
  label,
  children,
}) => (
  <div className="flex items-start gap-3">
    <span className="text-muted-foreground mt-0.5">{icon}</span>
    <div className="min-w-0">
      <dt className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
        {label}
      </dt>
      <dd className="text-sm text-foreground mt-0.5">{children}</dd>
    </div>
  </div>
);

export default CertificateDetail;
