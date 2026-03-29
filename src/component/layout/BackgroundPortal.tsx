import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
import { LazyThreeBackground } from "./LazyThreeBackground";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { useLocation } from "wouter";
import { isModelPreloaded } from "../../hooks/usePreloadAssets";

/**
 * Renders background layers (image or Three.js) via a portal to document.body.
 * This avoids being trapped inside framer-motion's stacking context,
 * which would break position:fixed on the background.
 */
export const BackgroundPortal = () => {
  const [location] = useLocation();
  const { currentBackground } = useBackgroundImageStore();
  const [shouldShowThreeBackground, setShouldShowThreeBackground] =
    useState(false);

  const threeComponentCache = useRef<React.ReactElement | null>(null);
  const isAboutRoute = location === "/about";

  useEffect(() => {
    if (currentBackground?.type === "three" && isAboutRoute) {
      if (isModelPreloaded("/models/logo4.glb")) {
        setShouldShowThreeBackground(true);
        return;
      }

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

    const isMobile = window.innerWidth < 1280;

    if (
      currentBackground.type === "three" &&
      shouldShowThreeBackground &&
      isAboutRoute &&
      !isMobile
    ) {
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

    if (currentBackground.type === "three" && isAboutRoute && isMobile) {
      return <div className="fixed inset-0 z-0 bg-black" />;
    }

    if (currentBackground.type === "image") {
      return <ImageBackgroundDisplay />;
    }

    return null;
  };

  const content = renderBackground();
  if (!content) return null;

  return createPortal(content, document.body);
};
