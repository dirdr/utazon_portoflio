import { AnimatePresence, motion } from 'framer-motion';
import { useAppLoading } from '../../contexts/AppLoadingContext';
import { GlobalLoader } from '../loader/GlobalLoader';

/**
 * GlobalLoaderWrapper handles the global loading screen for the entire app
 * 
 * Features:
 * - Shows GlobalLoader on fresh page loads (ALL routes)
 * - Smooth fade transition from loader to app content
 * - Proper AnimatePresence for exit animations
 * - Works consistently across all routes
 */
export const GlobalLoaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { showLoader } = useAppLoading();

  return (
    <div className="relative w-full min-h-screen">
      <AnimatePresence mode="wait">
        {showLoader ? (
          <GlobalLoader key="global-loader" />
        ) : (
          <motion.div
            key="app-content"
            className="w-full min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1],
              delay: 0.1
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};