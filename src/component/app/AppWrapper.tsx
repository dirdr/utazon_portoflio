import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { GlobalLoader } from '../loader/GlobalLoader';
import { useAppInitialization } from '../../hooks/useAppInitialization';

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
  const { 
    showLoader, 
    isInitialized, 
    progress, 
    loadedAssets, 
    totalAssets, 
    failedAssets 
  } = useAppInitialization();

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

  // Show loader or app content (no AnimatePresence to avoid conflicts)
  if (showLoader) {
    return (
      <GlobalLoader
        showProgress={true}
        progress={progress}
        loadedAssets={loadedAssets}
        totalAssets={totalAssets}
        failedAssets={failedAssets}
      />
    );
  }

  return (
    <div className="w-full min-h-screen">
      {children}
    </div>
  );
};