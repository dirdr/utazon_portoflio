import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useAppLoading } from '../../contexts/AppLoadingContext';
import { GlobalLoader } from '../loader/GlobalLoader';
import { useBackgroundImageStore } from '../../hooks/useBackgroundImageStore';
import { useCanvasReadiness } from '../../hooks/useCanvasReadiness';
import { getRouteAssets, shouldPreloadRoute } from '../../config/routeAssets';
import { isMobile } from '../../utils/mobileDetection';
import backgroundImage from '../../assets/images/background.webp';
import backgroundMobileImage from '../../assets/images/background_mobile.png';
import { useState, useCallback, useEffect, useRef } from 'react';

const shouldWaitForCanvas = (route: string): boolean => {
  return route === "/about" && !isMobile();
};

const getBackgroundForRoute = (route: string): string => {
  if (route === "/projects" || route === "/contact" || route === "/showreel" || route === "/legal") {
    return isMobile() ? backgroundMobileImage : backgroundImage;
  }
  return "";
};

/**
 * GlobalLoaderWrapper handles the global loading screen for the entire app
 *
 * Features:
 * - Shows GlobalLoader on fresh page loads (ALL routes)
 * - Smooth fade transition from loader to app content
 * - Proper AnimatePresence for exit animations
 * - Cache coordination and background settings after loading
 * - Works consistently across all routes
 */
export const GlobalLoaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [location] = useLocation();
  const { showLoader } = useAppLoading();
  const { setBackgroundImage } = useBackgroundImageStore();
  const { areAllCanvasesReady, onCanvasReadyChange, resetAllCanvases } = useCanvasReadiness();
  const [isCoordinating, setIsCoordinating] = useState(false);
  const hasCoordinatedRef = useRef(false);

  const verifyCacheUrls = useCallback((urls: string[]): Promise<void> => {
    if (urls.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let completedCount = 0;
      const totalCount = urls.length;

      const checkComplete = () => {
        completedCount++;
        if (completedCount === totalCount) {
          resolve();
        }
      };

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

      urls.forEach((url, index) => {
        const img = new Image();
        img.addEventListener("load", checkComplete);
        img.addEventListener("error", checkComplete);

        if (isSafari || isFirefox) {
          img.crossOrigin = "anonymous";
          setTimeout(() => {
            img.src = url;
          }, index * 15);
        } else {
          img.src = url;
        }
      });
    });
  }, []);

  const waitForCanvasReadiness = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (areAllCanvasesReady()) {
        resolve();
        return;
      }

      const unsubscribe = onCanvasReadyChange((allReady) => {
        if (allReady) {
          unsubscribe();
          resolve();
        }
      });

      setTimeout(() => {
        unsubscribe();
        resolve();
      }, 2000);
    });
  }, [areAllCanvasesReady, onCanvasReadyChange]);

  useEffect(() => {
    if (!showLoader && !hasCoordinatedRef.current) {
      hasCoordinatedRef.current = true;
      setIsCoordinating(true);

      const coordinateAfterLoading = async () => {
        try {
          // Set background for current route
          const newBackground = getBackgroundForRoute(location);
          if (newBackground) {
            setBackgroundImage(newBackground, "GlobalLoaderWrapper");
          } else {
            setBackgroundImage(null, "GlobalLoaderWrapper");
          }

          // Verify route-specific cache URLs
          const shouldPreload = shouldPreloadRoute(location);
          const cacheUrls = shouldPreload ? getRouteAssets(location) : [];

          if (cacheUrls.length > 0) {
            await verifyCacheUrls(cacheUrls);
          }

          // Reset canvases for proper initialization
          resetAllCanvases();

          // Wait for canvas readiness if needed
          if (shouldWaitForCanvas(location)) {
            await waitForCanvasReadiness();
          }
        } finally {
          setIsCoordinating(false);
        }
      };

      coordinateAfterLoading();
    }
  }, [showLoader, location, setBackgroundImage, verifyCacheUrls, resetAllCanvases, waitForCanvasReadiness]);

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
              delay: isCoordinating ? 0.2 : 0.1
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};