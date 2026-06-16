import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import { certificates } from '@/data/certificates';

/* ─── Sub-components ──────────────────────────────────────────────── */

/** Quiet stat with proper dl semantics. */
const CertStat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div>
    <dt className="eyebrow mb-1">{label}</dt>
    <dd className="fluid-h2 text-foreground font-semibold tabular-nums">{value}</dd>
  </div>
);

/** Issuer chip — minimal, monospaced. */
const IssuerChip: React.FC<{ name: string }> = ({ name }) => (
  <li
    className={cn(
      'px-3 py-1.5 text-xs font-mono text-muted-foreground',
      'border border-white/[0.08] rounded-md bg-white/[0.02]',
      'transition-colors duration-200 hover:border-white/[0.14] hover:text-foreground/80'
    )}
  >
    {name}
  </li>
);

/* ─── Section ─────────────────────────────────────────────────────── */

const CertificatesSection: React.FC = () => {
  const technicalCount = useMemo(
    () => certificates.filter((c) => c.category === 'technical').length,
    []
  );
  const participationCount = useMemo(
    () => certificates.filter((c) => c.category === 'participation').length,
    []
  );

  // Surface unique issuers from technical certificates as credibility chips.
  const issuers = useMemo(
    () =>
      Array.from(
        new Set(
          certificates
            .filter((c) => c.category === 'technical')
            .map((c) => c.issuer)
        )
      ).slice(0, 8),
    []
  );

  return (
    <section id="certificates" className="section-y relative" aria-label="Certificates and credentials">
      <div className="container mx-auto px-4 max-w-[1100px]">
        <SectionHeading
          eyebrow="Recognition"
          title="Credentials & continuing education."
          subtitle="Certifications I've earned along the way — kept here as supporting credibility, not the headline."
          alignment="left"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-start"
        >
          {/* Stat block — proper dl semantics */}
          <dl className="flex md:flex-col gap-8 md:gap-6 md:min-w-[160px]" aria-label="Certificate counts">
            <CertStat value={`${technicalCount}+`} label="Technical" />
            <CertStat value={`${participationCount}+`} label="Participation" />
          </dl>

          {/* Issuer chips */}
          <div>
            <p className="text-sm text-muted-foreground mb-5 inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Issued by
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Certificate issuers">
              {issuers.map((issuer) => (
                <IssuerChip key={issuer} name={issuer} />
              ))}
            </ul>

            <Link
              to="/certificates"
              className={cn(
                'mt-8 inline-flex items-center gap-2 text-sm text-foreground',
                'border-b border-white/[0.15] pb-1',
                'transition-colors duration-200 hover:border-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded'
              )}
            >
              Browse all certificates
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CertificatesSection;
