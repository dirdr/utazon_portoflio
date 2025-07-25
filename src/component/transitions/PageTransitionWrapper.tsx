import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

export interface PageTransitionWrapperProps {
  children: ReactNode;
  pageKey: string; // Unique identifier for the current page
  className?: string;
}

// Animation variants for smooth page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.05,
  },
};

// Transition configuration optimized for GPU acceleration
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// Exit transition (slightly faster for better UX)
const exitTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

/**
 * PageTransitionWrapper provides smooth fade in/out animations between route changes
 * 
 * Features:
 * - GPU-accelerated animations (opacity, transform only)
 * - Interruptible-safe transitions
 * - Optimized for React Router v7+
 * - Prevents layout shift during transitions
 */
export const PageTransitionWrapper = ({ 
  children, 
  pageKey, 
  className = '' 
}: PageTransitionWrapperProps) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        className={`w-full h-full ${className}`}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        // Optimizations for better performance
        style={{
          willChange: 'opacity, transform',
          backfaceVisibility: 'hidden',
          perspective: 1000,
        }}
        // Exit transition override
        exit={{
          ...pageVariants.out,
          transition: exitTransition,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Higher-order component to wrap pages with transitions
 * Usage: export default withPageTransition(YourPageComponent, 'unique-page-key');
 */
export const withPageTransition = <P extends object>(
  Component: React.ComponentType<P>,
  pageKey: string
) => {
  const WrappedComponent = (props: P) => (
    <PageTransitionWrapper pageKey={pageKey}>
      <Component {...props} />
    </PageTransitionWrapper>
  );

  WrappedComponent.displayName = `withPageTransition(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};