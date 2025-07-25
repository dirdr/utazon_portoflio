import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

export interface OptimalPageTransitionProps {
  children: ReactNode;
  pageKey: string;
  className?: string;
}

// Motion variants for consistent animations
const pageVariants: Variants = {
  initial: { 
    opacity: 0,
    // Subtle y-movement for polish (GPU accelerated)
    y: 8
  },
  in: { 
    opacity: 1,
    y: 0
  },
  out: { 
    opacity: 0,
    y: -8
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1], // Custom easing for smooth motion
  duration: 0.4
};

/**
 * Optimal page transition for Wouter + Framer Motion
 * 
 * Features:
 * - Single AnimatePresence (no conflicts)
 * - GPU-accelerated animations
 * - Accessibility support (reduced motion)
 * - Industry-standard easing
 * - Layout isolation via absolute positioning
 */
export const OptimalPageTransition = ({
  children,
  pageKey,
  className = ''
}: OptimalPageTransitionProps) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Disable animations if user prefers reduced motion
  const transition = shouldReduceMotion 
    ? { duration: 0.1 } 
    : pageTransition;
    
  const variants = shouldReduceMotion
    ? { initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } }
    : pageVariants;

  return (
    <div className="relative w-full min-h-screen">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pageKey}
          className={`absolute inset-0 w-full ${className}`}
          initial="initial"
          animate="in"
          exit="out"
          variants={variants}
          transition={transition}
          style={{
            // GPU optimizations
            willChange: 'opacity, transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};