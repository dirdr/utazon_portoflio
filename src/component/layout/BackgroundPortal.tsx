import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
import { LazyThreeBackground } from "./LazyThreeBackground";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { useLocation } from "wouter";
import { isModelPreloaded } from "../../hooks/usePreloadAssets";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Renders background layers (image or Three.js) via a portal to document.body.
 * - Three.js background is shown on /about (desktop only), driven by route, not by component effects.
 * - Image backgrounds are driven by the zustand store.
 * - Portal to document.body avoids framer-motion stacking context traps.
 */
export const BackgroundPortal = () => {
  const [location] = useLocation();
  const { currentBackground } = useBackgroundImageStore();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isAboutRoute = location === "/about";
  const showThreeBackground = isAboutRoute && isDesktop;

  const [isModelReady, setIsModelReady] = useState(false);
  const threeComponentCache = useRef<React.ReactElement | null>(null);

  // Track model readiness for the Three.js background
  useEffect(() => {
    if (!showThreeBackground) {
      setIsModelReady(false);
      threeComponentCache.current = null;
      return;
    }

    if (isModelPreloaded("/models/logo4.glb")) {
      setIsModelReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (isModelPreloaded("/models/logo4.glb")) {
        setIsModelReady(true);
        clearInterval(interval);
      }
    }, 50);

    const timeout = setTimeout(() => {
      setIsModelReady(true);
      clearInterval(interval);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showThreeBackground]);

  const renderBackground = () => {
    // Three.js background for /about on desktop
    if (showThreeBackground && isModelReady) {
      if (!threeComponentCache.current) {
        threeComponentCache.current = (
          <LazyThreeBackground planeOpaque={false} bloomEnabled={true} />
        );
      }
      return threeComponentCache.current;
    }

    // Black fallback for /about on mobile
    if (isAboutRoute && !isDesktop) {
      return <div className="fixed inset-0 z-0 bg-black" />;
    }

    // Image backgrounds (projects, etc.)
    if (currentBackground?.type === "image") {
      return <ImageBackgroundDisplay />;
    }

    return null;
  };

  const content = renderBackground();
  if (!content) return null;

  return createPortal(content, document.body);
};
