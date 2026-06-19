import React, { useDeferredValue, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { certificates, Certificate } from '@/data/certificates';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import SectionHeading from '@/components/ui/SectionHeading';
import PageTransition from '@/components/ui/PageTransition';
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
    <PageTransition>
      <div className="min-h-dvh flex flex-col">
        <SEO
          title="Certificates"
          description="Certifications and credentials — AWS, Red Hat RHCSA, Cisco CCNA, Google Flutter, NPTEL and more."
          path="/certificates"
        />
        <Navbar />

        <main className="flex-grow pt-28 pb-24">
          <div className="container mx-auto px-4 max-w-[1100px]">
            <SectionHeading
              as="h1"
              eyebrow="Recognition"
              title="Certifications & credentials."
              subtitle="A complete index of the courses, exams, and events I've earned recognition for — kept as supporting evidence."
              alignment="left"
            />

            {/* Stat row */}
            <dl
              className="grid grid-cols-3 gap-6 pb-12 mb-12 border-b border-border"
              aria-label="Certificate counts"
            >
              <Stat label="Total" value={certificates.length} />
              <Stat label="Technical" value={technical} />
              <Stat label="Participation" value={participation} />
            </dl>

            {/* Search + filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="relative flex-1">
                <label htmlFor="cert-search" className="sr-only">
                  Search certificates
                </label>
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="cert-search"
                  type="search"
                  inputMode="search"
                  placeholder="Search by title, issuer, or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    'w-full pl-11 pr-11 h-12 rounded-full',
                    'bg-muted/30 border border-border',
                    'text-[15px] placeholder:text-muted-foreground/50',
                    'focus:border-foreground/25 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all duration-200'
                  )}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div
                role="group"
                aria-label="Filter by category"
                className="flex flex-wrap gap-2"
              >
                {(Object.keys(CATEGORY_LABEL) as CategoryFilter[]).map((opt) => {
                  const active = category === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCategory(opt)}
                      aria-pressed={active}
                      className={cn(
                        'px-5 h-12 rounded-full text-[13px] font-medium transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        active
                          ? 'bg-foreground text-background shadow-[0_1px_2px_rgba(255,255,255,0.1)]'
                          : 'bg-muted/30 text-muted-foreground border border-border hover:text-foreground hover:bg-muted/40 hover:border-foreground/15'
                      )}
                    >
                      {CATEGORY_LABEL[opt]}{' '}
                      <span className={cn('ml-1.5 opacity-60 text-[11px]', active ? 'text-background' : 'text-muted-foreground font-mono')}>
                        {counts[opt]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Result count */}
            <p className="text-[13px] font-medium text-muted-foreground/80 mb-6" aria-live="polite">
              Showing {filtered.length} of {certificates.length}
            </p>

            {/* Grid */}
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
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.1) }}
                  >
                    <CertificateListCard cert={cert} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <p className="text-[15px] text-muted-foreground mb-6">
                  No certificates match your search filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-muted/40 border border-border text-[14px] font-medium text-foreground hover:bg-muted/60 hover:border-foreground/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Reset filters
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

const Stat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <dt className="eyebrow text-muted-foreground">{label}</dt>
    <dd className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground tabular-nums">
      {value}
    </dd>
  </div>
);

export default Certificates;
