import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { certificates } from '@/data/certificates';

const CertificatesSection: React.FC = () => {
  const technicalCount = certificates.filter((c) => c.category === 'technical').length;
  const participationCount = certificates.filter((c) => c.category === 'participation').length;

  // Surface a handful of issuers as quiet credibility chips
  const issuers = Array.from(
    new Set(certificates.filter((c) => c.category === 'technical').map((c) => c.issuer))
  ).slice(0, 8);

  return (
    <section id="certificates" className="section-y relative">
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
          {/* Quiet stat block */}
          <div className="flex md:flex-col gap-8 md:gap-6 md:min-w-[160px]">
            <div>
              <div className="fluid-h2 text-foreground font-semibold">{technicalCount}+</div>
              <p className="eyebrow mt-1">Technical</p>
            </div>
            <div>
              <div className="fluid-h2 text-foreground font-semibold">{participationCount}+</div>
              <p className="eyebrow mt-1">Participation</p>
            </div>
          </div>

          {/* Issuer logos as text chips */}
          <div>
            <p className="text-sm text-muted-foreground mb-5 inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Issued by
            </p>
            <div className="flex flex-wrap gap-2">
              {issuers.map((issuer) => (
                <span
                  key={issuer}
                  className="px-3 py-1.5 text-xs font-mono text-muted-foreground border border-white/[0.08] rounded-md bg-white/[0.02]"
                >
                  {issuer}
                </span>
              ))}
            </div>

            <Link
              to="/certificates"
              className="mt-8 inline-flex items-center gap-2 text-sm text-foreground border-b border-white/[0.15] pb-1 hover:border-foreground transition-colors"
            >
              Browse all certificates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CertificatesSection;
