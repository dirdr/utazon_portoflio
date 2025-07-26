import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface HomeToPageTransitionProps {
  children: ReactNode;
  pageKey: string;
  isFromHome: boolean;
  className?: string;
}

const fromHomeVariants = {
  initial: { opacity: 0, y: 6 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -6, position: "absolute" as const, top: 0, left: 0, right: 0 },
};

const homePageVariants = {
  initial: { opacity: 0, y: -6 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -6, position: "absolute" as const, top: 0, left: 0, right: 0 },
};

const defaultVariants = {
  initial: { opacity: 0, y: 4 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -4, position: "absolute" as const, top: 0, left: 0, right: 0 },
};

const fromHomeTransition = {
  type: 'tween' as const,
  ease: [0.2, 0, 0.2, 1] as [number, number, number, number],
  duration: 0.35,
};

const defaultTransition = {
  type: 'tween' as const,
  ease: [0.2, 0, 0.2, 1] as [number, number, number, number],
  duration: 0.25,
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