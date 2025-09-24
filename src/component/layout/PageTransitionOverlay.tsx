import { useEffect, useState, useCallback, useRef } from "react";
import { OVERLAY_Z_INDEX } from "../../constants/overlayZIndex";
import { isMobile } from "../../utils/mobileDetection";

interface PageTransitionOverlayProps {
  isTransitioning: boolean;
  duration: number;
  onFadeInComplete?: () => void;
}

export const PageTransitionOverlay = ({
  isTransitioning,
  duration,
  onFadeInComplete,
}: PageTransitionOverlayProps) => {
  const [phase, setPhase] = useState<
    "hidden" | "fading-in" | "visible" | "fading-out"
  >("hidden");
  const overlayRef = useRef<HTMLDivElement>(null);
  const isMobileDevice = isMobile();
  const updateOverlayDimensions = useCallback(() => {
    if (!isMobileDevice || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    overlay.style.height = `${viewportHeight}px`;
    overlay.style.width = `${viewportWidth}px`;
  }, [isMobileDevice]);

  useEffect(() => {
    if (isTransitioning && phase === "hidden") {
      setPhase("fading-in");
      updateOverlayDimensions();

      setTimeout(() => {
        setPhase("visible");
        updateOverlayDimensions();

        setTimeout(() => {
          onFadeInComplete?.();
        }, duration / 2);
      }, 16);
    } else if (!isTransitioning && phase === "visible") {
      setPhase("fading-out");

      setTimeout(() => {
        setPhase("hidden");
      }, duration / 2);
    }
  }, [isTransitioning, phase, duration, onFadeInComplete, updateOverlayDimensions]);

  useEffect(() => {
    if (!isMobileDevice || phase === "hidden") return;

    const handleResize = () => {
      setTimeout(updateOverlayDimensions, 50);
    };

    const handleOrientationChange = () => {
      setTimeout(updateOverlayDimensions, 50);
      setTimeout(updateOverlayDimensions, 200);
      setTimeout(updateOverlayDimensions, 500);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobileDevice, phase, updateOverlayDimensions]);

  if (phase === "hidden") return null;

  const opacity = phase === "visible" || phase === "fading-out" ? 1 : 0;
  const shouldFadeOut = phase === "fading-out";

  return (
    <div
      ref={overlayRef}
      className="fixed bg-black transition-opacity ease-in-out"
      style={{
        opacity: shouldFadeOut ? 0 : opacity,
        transitionDuration: `${duration / 2}ms`,
        zIndex: OVERLAY_Z_INDEX.PAGE_TRANSITION_OVERLAY,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...(isMobileDevice
          ? {
              height: `${window.innerHeight}px`,
              width: `${window.innerWidth}px`,
            }
          : {
              height: '100dvh',
              width: '100vw',
            }
        ),
        willChange: 'opacity',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        touchAction: 'none',
        overflow: 'hidden',
      }}
    />
  );
};

