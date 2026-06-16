import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { experiences } from '@/data/experience';

const ExperienceSection: React.FC = () => {
  const recent = [...experiences]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);

  return (
    <section id="experience" className="section-y relative">
      <div className="container mx-auto px-4 max-w-[1100px]">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've worked and what I shipped."
          subtitle="Internships, leadership, and a startup co-founder role — in chronological order."
          alignment="left"
        />

        <div className="relative">
          {/* Single quiet rail */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-white/[0.08]" aria-hidden />

          <div className="space-y-14">
            {recent.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Marker */}
                <div className="absolute left-0 top-2 -translate-x-[3px] w-[7px] h-[7px] rounded-full bg-primary" />

                <p className="eyebrow mb-2">
                  {exp.startDate} — {exp.endDate || 'Present'}
                </p>

                <h3 className="fluid-h3 text-foreground mb-1">
                  {exp.role || exp.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {exp.company} · {exp.location}
                </p>

                <p className="fluid-body text-muted-foreground leading-relaxed prose-measure mb-4">
                  {exp.description}
                </p>

                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1.5 prose-measure">
                    {exp.achievements.slice(0, 2).map((a, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex gap-3">
                        <span className="text-primary mt-2 h-1 w-1 rounded-full bg-primary shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-14 pl-8 md:pl-12">
          <Link
            to="/experience"
            className="inline-flex items-center gap-2 text-sm text-foreground border-b border-white/[0.15] pb-1 hover:border-foreground transition-colors"
          >
            Full experience <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
