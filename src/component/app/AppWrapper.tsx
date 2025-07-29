import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { GlobalLoader } from '../loader/GlobalLoader';
import { useAppState } from '../../hooks/useAppState';
import { ROUTES } from '../../constants/routes';

export interface AppWrapperProps {
  children: React.ReactNode;
}

/**
 * AppWrapper handles global application initialization and loading state
 * 
 * Features:
 * - Global asset preloading with loading UI (ONLY on first load/refresh)
 * - Uses sessionStorage to persist state across route changes
 * - Smooth fade transition from loader to app
 * - Modern React patterns with custom hooks
 */
export const AppWrapper = ({ children }: AppWrapperProps) => {
  const [location] = useLocation();
  const isHomePage = location === ROUTES.HOME;
  
  const { showLoader } = useAppState();

  // Prevent body scroll while loader is active
  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLoader]);

  return (
    <div className="relative w-full min-h-screen">
      <AnimatePresence mode="wait">
        {showLoader ? (
          <GlobalLoader key="global-loader" />
        ) : (
          <motion.div
            key="app-content"
            className="w-full min-h-screen"
            initial={{ opacity: isHomePage ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={isHomePage ? { duration: 0 } : { 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1],
              delay: 0.1 // Small delay for polish
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};