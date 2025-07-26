import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface HomeToPageTransitionProps {
  children: ReactNode;
  pageKey: string;
  isFromHome: boolean;
  className?: string;
}

const fromHomeVariants = {
  initial: { opacity: 0, scale: 0.98, y: 20 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 1.02, y: -20, position: "absolute" as const, top: 0, left: 0, right: 0 },
};

const homePageVariants = {
  initial: { opacity: 0, scale: 1.02, y: -20 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 1.02, y: -20, position: "absolute" as const, top: 0, left: 0, right: 0 },
};

const defaultVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8, position: "absolute" as const, top: 0, left: 0, right: 0 },
};

const fromHomeTransition = {
  type: 'tween' as const,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  duration: 0.6,
};

const defaultTransition = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  duration: 0.4,
};

export const HomeToPageTransition = ({ 
  children, 
  pageKey, 
  isFromHome,
  className = '' 
}: HomeToPageTransitionProps) => {
  const isHomePage = pageKey === "/";
  const variants = isHomePage ? homePageVariants : isFromHome ? fromHomeVariants : defaultVariants;
  const transition = isFromHome && !isHomePage ? fromHomeTransition : defaultTransition;


  return (
    <div className="relative w-full min-h-full">
      <AnimatePresence 
        mode="wait"
        initial={isFromHome}
        onExitComplete={() => {
          window.scrollTo(0, 0);
        }}
      >
        <motion.div
          key={pageKey}
          className={`w-full ${className}`}
          initial="initial"
          animate="in"
          exit="out"
          variants={variants}
          transition={transition}
          style={{
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