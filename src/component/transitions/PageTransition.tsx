import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
  className?: string;
}

// Modern transition variants with layout preservation
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -8,
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
  },
};

// Staggered transitions for better UX
const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.4,
};

const exitTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1], 
  duration: 0.3, // Faster exit
};

/**
 * Layout-preserving page transition component (2025 best practices)
 * - Uses popLayout mode to prevent layout shifts
 * - Absolute positioning during exit
 * - Preserves container height during transitions
 */
export const PageTransition = ({ 
  children, 
  pageKey, 
  className = '' 
}: PageTransitionProps) => {
  console.log('📄 PageTransition render:', { 
    pageKey, 
    timestamp: Date.now() 
  });

  return (
    <LayoutGroup>
      <div className="relative w-full min-h-full">
        <AnimatePresence 
          mode="popLayout" 
          initial={false}
          onExitComplete={() => console.log('🚪 PageTransition exit complete:', pageKey)}
        >
          <motion.div
            key={pageKey}
            className={`w-full ${className}`}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{
              willChange: 'opacity, transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            exit={{
              ...pageVariants.out,
              transition: exitTransition,
            }}
            layout
            onAnimationStart={(definition) => console.log('🎬 PageTransition animation start:', { pageKey, definition })}
            onAnimationComplete={(definition) => console.log('✅ PageTransition animation complete:', { pageKey, definition })}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};