import React, { memo } from 'react';
import { motion, HTMLMotionProps, MotionProps } from 'framer-motion';
import { prefersReducedMotion } from '@/utils/performance';

// Optimized motion components with reduced motion support

interface OptimizedMotionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  reducedMotionFallback?: MotionProps;
}

export const OptimizedMotionDiv = memo<OptimizedMotionProps>(({ 
  children, 
  reducedMotionFallback,
  ...props 
}) => {
  const shouldReduceMotion = prefersReducedMotion();
  
  if (shouldReduceMotion && reducedMotionFallback) {
    return (
      <motion.div {...reducedMotionFallback}>
        {children}
      </motion.div>
    );
  }
  
  return (
    <motion.div {...props}>
      {children}
    </motion.div>
  );
});

OptimizedMotionDiv.displayName = 'OptimizedMotionDiv';

// Pre-configured motion variants for common animations
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
};

// Optimized stagger container
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// High-performance hover animations
export const optimizedHover = {
  whileHover: { 
    scale: 1.02, 
    transition: { duration: 0.2, ease: "easeOut" } 
  },
  whileTap: { 
    scale: 0.98, 
    transition: { duration: 0.1 } 
  }
};