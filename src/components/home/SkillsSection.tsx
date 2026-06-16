import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import { getSkillIconUrl, FALLBACK_SKILL_ICON } from '@/lib/skillIcons';

/* ─── Data ────────────────────────────────────────────────────────── */

interface CapabilityGroup {
  title: string;
  description: string;
  skillIds: string[];
}

const groups: CapabilityGroup[] = [
  {
    title: 'Mobile engineering',
    description:
      'Flutter-first. Cross-platform apps with Firebase, real-time data, and production-grade state management.',
    skillIds: ['flutter', 'firebase', 'androidstudio'],
  },
  {
    title: 'Web & full-stack',
    description:
      'React on the front, Node/Express on the back. Typed, tested, and shipped to small teams of real users.',
    skillIds: ['react', 'javascript', 'node', 'expressjs'],
  },
  {
    title: 'AI & data',
    description:
      'Practical AI: integrating OpenAI/Gemini, prototyping vision models, and running data through Python pipelines.',
    skillIds: ['python', 'mongodb', 'mysql'],
  },
  {
    title: 'Foundations & tooling',
    description:
      'Git, CI workflows, design tools, and the CS fundamentals that keep code maintainable.',
    skillIds: ['github', 'vscode', 'figma', 'aws'],
  },
];

/* ─── Sub-components ──────────────────────────────────────────────── */

/** Skill chip with icon — minimal, inline. */
const SkillChip: React.FC<{ id: string }> = ({ id }) => (
  <li
    className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-full',
      'border border-white/[0.08] bg-white/[0.02]',
      'text-xs text-muted-foreground'
    )}
  >
    <img
      src={getSkillIconUrl(id)}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      decoding="async"
      className="w-4 h-4 object-contain"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== FALLBACK_SKILL_ICON) img.src = FALLBACK_SKILL_ICON;
      }}
    />
    <span className="capitalize">{id}</span>
  </li>
);

/** Capability group card — numbered, editorial. */
const CapabilityCard: React.FC<{
  group: CapabilityGroup;
  index: number;
}> = ({ group, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    className="prose-measure-tight"
  >
    <p className="eyebrow eyebrow-accent mb-3" aria-hidden="true">
      0{index + 1}
    </p>
    <h3 className="fluid-h3 text-foreground mb-3">{group.title}</h3>
    <p className="text-muted-foreground leading-relaxed mb-6">
      {group.description}
    </p>
    <ul className="flex flex-wrap items-center gap-2" aria-label={`${group.title} tools`}>
      {group.skillIds.map((id) => (
        <SkillChip key={id} id={id} />
      ))}
    </ul>
  </motion.article>
);

/* ─── Section ─────────────────────────────────────────────────────── */

const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="section-y relative" aria-label="Skills and capabilities">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <SectionHeading
          eyebrow="Capabilities"
          title="What I work with."
          subtitle="I optimize for depth over breadth — these are the areas where I can move quickly and ship confidently."
          alignment="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 lg:gap-y-16">
          {groups.map((group, idx) => (
            <CapabilityCard key={group.title} group={group} index={idx} />
          ))}
        </div>

        <div className="mt-16">
          <Link
            to="/skills"
            className={cn(
              'inline-flex items-center gap-2 text-sm text-foreground',
              'border-b border-white/[0.15] pb-1',
              'transition-colors duration-200 hover:border-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded'
            )}
          >
            See the full technology list
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
