import React, { createContext, useContext } from 'react';
import { useAppInitialization } from '../hooks/useAppInitialization';

interface AppLoadingState {
  // Loading state
  showLoader: boolean;
  isInitialized: boolean;
  
  // Asset preloading
  progress: number;
  loadedAssets: number;
  totalAssets: number;
  failedAssets: number;
  
  // Navigation state
  isFreshLoad: boolean;
  
  // Home-specific dive-in state (for integration with HomeContext)
  showDiveInButton: boolean;
  hideDiveInButton: () => void;
  
  // Video behavior (for integration with HomeContext)
  videoBehavior: {
    shouldPlayFromStart: boolean;
    shouldJumpTo8s: boolean;
    isDiveInFlow: boolean;
  };
}

const AppLoadingContext = createContext<AppLoadingState | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppLoading = (): AppLoadingState => {
  const context = useContext(AppLoadingContext);
  if (!context) {
    throw new Error('useAppLoading must be used within AppLoadingProvider');
  }
  return context;
};

interface AppLoadingProviderProps {
  children: React.ReactNode;
}

export const AppLoadingProvider: React.FC<AppLoadingProviderProps> = ({ children }) => {
  const appInit = useAppInitialization();

  // Note: Scroll blocking removed - only home page should be non-scrollable

  const value: AppLoadingState = {
    showLoader: appInit.showLoader,
    isInitialized: appInit.isInitialized,
    progress: appInit.progress,
    loadedAssets: appInit.loadedAssets,
    totalAssets: appInit.totalAssets,
    failedAssets: appInit.failedAssets,
    isFreshLoad: appInit.isFreshLoad,
    showDiveInButton: appInit.showDiveInButton,
    hideDiveInButton: appInit.hideDiveInButton,
    videoBehavior: appInit.videoBehavior,
  };

  return (
    <AppLoadingContext.Provider value={value}>
      {children}
    </AppLoadingContext.Provider>
  );
};