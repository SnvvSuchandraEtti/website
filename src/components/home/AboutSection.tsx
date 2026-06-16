import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import aboutPortrait from '@/assets/profile/suchandra-about-portrait.jpg.asset.json';

const stats = [
  { value: '7+', label: 'Major projects' },
  { value: '28K+', label: 'Users reached' },
  { value: '500+', label: 'Problems solved' },
  { value: 'Top 5%', label: 'Global ranking' },
];

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section-y relative">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <SectionHeading
          eyebrow="About"
          title="A student engineer learning by shipping."
          subtitle="Final-year CSE at Aditya Engineering College. Working at the intersection of mobile, web, and AI — and on a startup in between."
          alignment="left"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-12 lg:gap-20 items-start">
          {/* Portrait — single, calm */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-card aspect-[4/5]"
          >
            <img
              src={aboutPortrait.url}
              alt="Suchandra Etti portrait"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="eyebrow text-foreground/70 mb-1">Currently</p>
              <p className="text-sm font-medium text-foreground">
                Building Leez — a P2P rental marketplace.
              </p>
            </div>
          </motion.div>

          {/* Editorial story */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="prose-measure"
          >
            <div className="space-y-6 fluid-body text-muted-foreground leading-[1.75]">
              <p>
                I picked up programming because I wanted to build things people would
                actually use. Six years later, that's still the only metric I care
                about. Flutter and React are my daily drivers; Node, Python, and
                Firebase round out the stack.
              </p>
              <p>
                Along the way I've shipped{' '}
                <span className="text-foreground">HOOT 2.0</span> (10,000+ students)
                and <span className="text-foreground">S-TRACK</span> (18,000+ users),
                interned at Technical Hub, coordinated workshops for 2,500+ students
                through LEO Club, and represented college at hackathons across KL,
                GIET, JNTUK, and JNTUV.
              </p>
              <p>
                Right now I'm focused on{' '}
                <span className="text-foreground">Leez</span>, a peer-to-peer rental
                marketplace for local communities, and on sharpening the
                product-engineering fundamentals that turn side projects into
                companies.
              </p>
            </div>

            {/* Stats — inline metadata, not card grid */}
            <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="fluid-h3 text-foreground font-semibold">{s.value}</div>
                  <div className="eyebrow mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>

            <a
              href="/contact"
              className="mt-10 inline-flex items-center gap-2 text-sm text-foreground border-b border-white/[0.15] pb-1 hover:border-foreground transition-colors"
            >
              Reach out for collaborations
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
