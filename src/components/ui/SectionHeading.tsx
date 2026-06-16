import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
  alignment?: 'left' | 'center' | 'right';
  as?: 'h1' | 'h2' | 'h3';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  eyebrow,
  className,
  alignment = 'left',
  as = 'h2',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const MotionHeading = motion[as] as typeof motion.h2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('mb-14 max-w-3xl', alignment === 'center' && 'mx-auto', alignmentClasses[alignment], className)}
    >
      {eyebrow && (
        <p className="eyebrow eyebrow-accent mb-4">{eyebrow}</p>
      )}
      <MotionHeading
        className="fluid-h2 text-foreground"
      >
        {title}
      </MotionHeading>
      {subtitle && (
        <p
          className="mt-4 fluid-lead text-muted-foreground prose-measure"
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
