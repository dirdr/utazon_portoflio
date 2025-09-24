import React, { ReactNode, useState, useEffect, useRef } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
import { LazyThreeBackground } from "./LazyThreeBackground";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { useLocation } from "wouter";
import { getPageConfig } from "../../config/pageConfig";
import { isModelPreloaded } from "../../hooks/usePreloadAssets";

interface StandardLayoutProps {
  children: ReactNode;
  className?: string;
}

export const StandardLayout = ({
  children,
  className = "",
}: StandardLayoutProps) => {
  const [location] = useLocation();
  const pageConfig = getPageConfig(location);
  const { currentBackground } = useBackgroundImageStore();
  const [shouldShowThreeBackground, setShouldShowThreeBackground] = useState(false);

  const threeComponentCache = useRef<React.ReactElement | null>(null);
  const isAboutRoute = location === '/about';

  useEffect(() => {
    if (currentBackground?.type === 'three' && isAboutRoute) {
      const checkModel = () => {
        if (isModelPreloaded("/models/logo4.glb")) {
          setShouldShowThreeBackground(true);
        } else {
          const interval = setInterval(() => {
            if (isModelPreloaded("/models/logo4.glb")) {
              setShouldShowThreeBackground(true);
              clearInterval(interval);
            }
          }, 50);

          const timeout = setTimeout(() => {
            setShouldShowThreeBackground(true);
            clearInterval(interval);
          }, 2000);

          return () => {
            clearInterval(interval);
            clearTimeout(timeout);
          };
        }
      };

      checkModel();
    } else {
      setShouldShowThreeBackground(false);
      if (!isAboutRoute) {
        threeComponentCache.current = null;
      }
    }
  }, [currentBackground, isAboutRoute]);

  const renderBackground = () => {
    if (!currentBackground) {
      return null;
    }

    // Check if mobile (below xl breakpoint - 1280px)
    const isMobile = window.innerWidth < 1280;

    // Only mount Three.js canvas when on about route AND on desktop
    if (currentBackground.type === 'three' && shouldShowThreeBackground && isAboutRoute && !isMobile) {
      // Use cached component if available, otherwise create new one
      if (!threeComponentCache.current) {
        threeComponentCache.current = (
          <LazyThreeBackground
            planeOpaque={currentBackground.options?.planeOpaque}
            bloomEnabled={currentBackground.options?.bloomEnabled}
          />
        );
      }
      return threeComponentCache.current;
    }

    // For mobile with Three.js background, render black background instead
    if (currentBackground.type === 'three' && isAboutRoute && isMobile) {
      return (
        <div
          className="fixed inset-0 bg-black"
          style={{ zIndex: -20 }}
        />
      );
    }

    if (currentBackground.type === 'image') {
      return <ImageBackgroundDisplay />;
    }

    return null;
  };


  return (
    <div className="relative min-h-screen">
      {renderBackground()}
      <div
        className={`min-h-screen flex flex-col ${className}`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        {pageConfig.showFooter && <Footer />}
      </div>
    </div>
  );
};
