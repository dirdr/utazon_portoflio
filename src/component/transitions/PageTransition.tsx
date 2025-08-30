import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
  className?: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 4 },
  in: { opacity: 1, y: 0 },
  out: {
    opacity: 0,
    y: -4,
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.2, 0, 0.2, 1] as [number, number, number, number],
  duration: 0.3,
};

export const PageTransition = ({
  children,
  pageKey,
  className = "",
}: PageTransitionProps) => {
  return (
    <div className="relative w-full min-h-full">
      <AnimatePresence
        mode="wait"
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
            willChange: "opacity, transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
