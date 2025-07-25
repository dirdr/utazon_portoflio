import { motion, AnimatePresence, Variants } from "framer-motion";
import { ReactNode } from "react";

export interface SimpleFadeTransitionProps {
  children: ReactNode;
  pageKey: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -16,
  },
};

export const SimpleFadeTransition = ({
  children,
  pageKey,
  className = "",
  style = {},
}: SimpleFadeTransitionProps) => {
  const isHomePage = pageKey === "/";

  const shouldDisableTransition = isHomePage;

  return (
    <div className={`w-full ${isHomePage ? "h-full" : ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pageKey}
          className={`${isHomePage ? "h-full" : ""} w-full ${className}`}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          style={{
            willChange: "opacity, transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            ...style,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
