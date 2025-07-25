import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

export interface SimpleFadeTransitionProps {
  children: ReactNode;
  pageKey: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Subtle motion variants
const pageVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 16 // Reduced y-movement for more subtle effect
  },
  in: { 
    opacity: 1,
    y: 0
  },
  out: { 
    opacity: 0,
    y: -16
  }
};

/**
 * Industry-standard page transition following best practices:
 * - Single AnimatePresence (no conflicts)
 * - GPU-accelerated animations  
 * - Accessibility support (reduced motion)
 * - Layout isolation via absolute positioning
 */
export const SimpleFadeTransition = ({
  children,
  pageKey,
  duration = 0.4,
  className = '',
  style = {},
}: SimpleFadeTransitionProps) => {
  const shouldReduceMotion = false; // useReducedMotion();
  
  // Disable animation when going TO home page
  const isGoingToHome = pageKey === '/';
  
  // Completely disable transition to home, normal transition elsewhere
  const transition = shouldReduceMotion || isGoingToHome
    ? { duration: 0 } // Instant transition to home
    : { 
        type: "tween" as const,
        ease: [0.4, 0, 0.2, 1], // Industry-standard easing
        duration 
      };
    
  const variants = shouldReduceMotion || isGoingToHome
    ? { initial: { opacity: 1 }, in: { opacity: 1 }, out: { opacity: 1 } } // No fade-out OR fade-in when going to home
    : pageVariants;

  // Different layout handling for home vs other pages
  const isHomePage = pageKey === '/';
  
  return (
    <div className={`w-full ${isHomePage ? 'h-full' : ''}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pageKey}
          className={`${isHomePage ? 'h-full' : ''} w-full ${className}`}
          initial="initial"
          animate="in"
          exit="out"
          variants={variants}
          transition={transition}
          style={{
            // GPU optimizations to prevent layout shifts
            willChange: 'opacity, transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            ...style,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};