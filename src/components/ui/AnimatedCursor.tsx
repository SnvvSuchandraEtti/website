
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 500);
    };

    const handleLinkHoverStart = () => setLinkHovered(true);
    const handleLinkHoverEnd = () => setLinkHovered(false);
    
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    // Listen for cursor movement
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    // Find all clickable elements and add hover listeners
    const clickableElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    clickableElements.forEach(el => {
      el.addEventListener('mouseenter', handleLinkHoverStart);
      el.addEventListener('mouseleave', handleLinkHoverEnd);
    });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      
      clickableElements.forEach(el => {
        el.removeEventListener('mouseenter', handleLinkHoverStart);
        el.removeEventListener('mouseleave', handleLinkHoverEnd);
      });
    };
  }, []);

  const cursorVariants = {
    default: {
      height: 32,
      width: 32,
      x: position.x - 16,
      y: position.y - 16,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      mixBlendMode: "difference" as const,
      border: "1px solid rgba(255, 255, 255, 0.15)",
    },
    link: {
      height: 48,
      width: 48,
      x: position.x - 24,
      y: position.y - 24,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      mixBlendMode: "difference" as const,
      border: "1px solid rgba(255, 255, 255, 0.25)",
    },
    clicked: {
      height: 24,
      width: 24,
      x: position.x - 12,
      y: position.y - 12,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
    }
  };

  const dotVariants = {
    default: {
      height: 8,
      width: 8,
      x: position.x - 4,
      y: position.y - 4,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    link: {
      height: 10,
      width: 10,
      x: position.x - 5,
      y: position.y - 5,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    clicked: {
      height: 6,
      width: 6,
      x: position.x - 3,
      y: position.y - 3,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    }
  };

  const cursorVariant = clicked ? "clicked" : linkHovered ? "link" : "default";

  // Only show on desktop
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      <motion.div
        className="cursor-outer fixed top-0 left-0 rounded-full pointer-events-none z-[999] backdrop-blur-sm"
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
        style={{ opacity: hidden ? 0 : 1 }}
      />
      <motion.div
        className="cursor-dot fixed top-0 left-0 rounded-full pointer-events-none z-[999]"
        variants={dotVariants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 30,
          mass: 0.2
        }}
        style={{ opacity: hidden ? 0 : 1 }}
      />
    </>
  );
};

export default AnimatedCursor;
