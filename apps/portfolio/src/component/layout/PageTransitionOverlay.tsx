import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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

  useEffect(() => {
    if (isTransitioning && phase === "hidden") {
      setPhase("fading-in");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("visible");
        });
      });
    } else if (!isTransitioning && phase === "visible") {
      setPhase("fading-out");

      setTimeout(() => {
        setPhase("hidden");
      }, duration / 2);
    }
  }, [isTransitioning, phase, duration]);

  useEffect(() => {
    if (phase === "visible") {
      const timer = setTimeout(() => {
        onFadeInComplete?.();
      }, duration / 2);
      return () => clearTimeout(timer);
    }
  }, [phase, duration, onFadeInComplete]);

  const isOpaque = phase === "visible";
  const isActive = phase !== "hidden";

  // Portalled to the body so no ancestor can become its containing block. A
  // transform or filter anywhere above would re-anchor this fixed element to
  // that box and let the page show through around it.
  return createPortal(
    <div
      className="page-transition-overlay"
      style={{ transitionDuration: `${duration / 2}ms` }}
      data-active={isActive}
      data-opaque={isOpaque}
    />,
    document.body,
  );
};
