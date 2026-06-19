
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Skill } from '@/data/skills';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getSkillIconUrl, FALLBACK_SKILL_ICON } from '@/lib/skillIcons';
import { ImageWithSkeleton } from '@/components/ui/ImageWithSkeleton';

interface SkillCardProps {
  skill: Skill;
  className?: string;
  index?: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, className, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  // Skill icon URLs are centralized in src/lib/skillIcons.ts

  const gradientStyle = skill.color ? {
    backgroundColor: isHovered ? `${skill.color}15` : 'transparent',
    borderColor: isHovered ? `${skill.color}66` : undefined
  } : {};

  return (
    <Link to={`/skills#${skill.id}`}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        whileHover={{ 
          y: -15,
          transition: { duration: 0.2, type: "spring", stiffness: 300 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          'glass-effect p-5 rounded-xl h-full flex flex-col shadow-lg border border-border backdrop-blur-md transition-all duration-300',
          isHovered ? 'shadow-xl shadow-primary/10' : 'shadow-md',
          className
        )}
        style={gradientStyle}
      >
        <div className="flex flex-col items-center text-center mb-4">
          <motion.div 
            animate={{ 
              rotate: isHovered ? [0, 10, 0] : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mb-3 p-3 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: isHovered ? (skill.color || 'hsl(var(--primary))') + '20' : 'transparent' }}
          >
            <ImageWithSkeleton 
              src={getSkillIconUrl(skill.id)} 
              loading="lazy"
              decoding="async"
              width={64}
              height={64}
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_SKILL_ICON; }}
              alt={skill.name} 
              className="object-contain"
            />
          </motion.div>
          <h3 className="font-semibold text-lg">{skill.name}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground flex-grow line-clamp-3 text-center">
          {skill.description}
        </p>
        
        {skill.certifications && skill.certifications.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0.8,
              height: 'auto' 
            }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-muted/50 text-xs"
          >
            <span className="font-medium text-foreground/80">Certifications:</span>
            <ul className="mt-1 space-y-1">
              {skill.certifications.map((cert, index) => (
                <li key={index} className="flex items-start gap-1.5">
                  <motion.span 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: isHovered ? [0, 5, 0] : 0
                    }}
                    transition={{ duration: 1, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
                    className="text-primary flex-shrink-0 mt-0.5"
                  >
                    •
                  </motion.span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Show "View Details" on hover with animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.2 }}
          className="mt-3 text-xs font-medium text-center"
          style={{ color: skill.color || 'hsl(var(--primary))' }}
        >
          View details →
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default SkillCard;
