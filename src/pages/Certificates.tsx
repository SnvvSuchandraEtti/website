import React, { useDeferredValue, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { certificates, Certificate } from '@/data/certificates';
import Navbar from '@/components/layout/Navbar';
import SectionHeading from '@/components/ui/SectionHeading';
import SmoothTransition from '@/components/ui/SmoothTransition';
import { Search, X } from 'lucide-react';
import CertificateListCard from '@/components/certificates/CertificateListCard';
import SEO from '@/components/seo/SEO';

type CategoryFilter = 'all' | 'technical' | 'participation';

const CATEGORY_LABEL: Record<CategoryFilter, string> = {
  all: 'All',
  technical: 'Technical',
  participation: 'Participation',
};

const Certificates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  // useDeferredValue keeps typing smooth on large lists.
  const deferredTerm = useDeferredValue(searchTerm);

  const { technical, participation } = useMemo(
    () => ({
      technical: certificates.filter((c) => c.category === 'technical').length,
      participation: certificates.filter((c) => c.category === 'participation').length,
    }),
    []
  );

  const filtered = useMemo<Certificate[]>(() => {
    const term = deferredTerm.trim().toLowerCase();
    return certificates.filter((c) => {
      if (category !== 'all' && c.category !== category) return false;
      if (!term) return true;
      return (
        c.title.toLowerCase().includes(term) ||
        c.issuer.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        !!c.skills?.some((s) => s.toLowerCase().includes(term))
      );
    });
  }, [deferredTerm, category]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('all');
  };

  const counts: Record<CategoryFilter, number> = {
    all: certificates.length,
    technical,
    participation,
  };

  return (
    <SmoothTransition>
      <div className="min-h-dvh flex flex-col">
        <SEO
          title="Certificates"
          description="Certifications and credentials — AWS, Red Hat RHCSA, Cisco CCNA, Google Flutter, NPTEL and more."
          path="/certificates"
        />
        <Navbar />

        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-[1100px]">
            <SectionHeading
              as="h1"
              eyebrow="Recognition"
              title="Certifications and credentials."
              subtitle="A complete index of the courses, exams, and events I've earned recognition for — kept as supporting evidence."
              alignment="left"
            />

            {/* Stat row */}
            <dl
              className="grid grid-cols-3 gap-8 pb-10 mb-10 border-b border-white/[0.08]"
              aria-label="Certificate counts"
            >
              <Stat label="Total" value={certificates.length} />
              <Stat label="Technical" value={technical} />
              <Stat label="Participation" value={participation} />
            </dl>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <div className="relative flex-1">
                <label htmlFor="cert-search" className="sr-only">
                  Search certificates
                </label>
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="cert-search"
                  type="search"
                  inputMode="search"
                  placeholder="Search by title, issuer, or skill…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 h-11 rounded-full bg-white/[0.02] border border-white/[0.08] focus:border-white/[0.18] focus:outline-none text-sm transition-colors"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded p-1"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
              <div
                role="group"
                aria-label="Filter by category"
                className="flex gap-1.5"
              >
                {(Object.keys(CATEGORY_LABEL) as CategoryFilter[]).map((opt) => {
                  const active = category === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCategory(opt)}
                      aria-pressed={active}
                      className={`px-4 h-11 rounded-full text-xs font-mono uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        active
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground border border-white/[0.08] hover:text-foreground hover:border-white/[0.16]'
                      }`}
                    >
                      {CATEGORY_LABEL[opt]}{' '}
                      <span className="opacity-50">({counts[opt]})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Result count for SR users and visual scanners */}
            <p className="text-xs text-muted-foreground mb-6" aria-live="polite">
              Showing {filtered.length} of {certificates.length}
            </p>

            {/* Grid — quiet cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.2) }}
                  >
                    <CertificateListCard cert={cert} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-6">
                  No certificates match your filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/[0.12] text-sm text-foreground hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </SmoothTransition>
  );
};

const Stat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div>
    <dd className="fluid-h3 text-foreground font-semibold tabular-nums">{value}</dd>
    <dt className="eyebrow mt-1.5">{label}</dt>
  </div>
);

export default Certificates;
