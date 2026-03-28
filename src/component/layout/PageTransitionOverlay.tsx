import { useEffect, useState } from "react";
import { OVERLAY_Z_INDEX } from "../../constants/overlayZIndex";

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

      setTimeout(() => {
        setPhase("visible");

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
  }, [isTransitioning, phase, duration, onFadeInComplete]);

  if (phase === "hidden") return null;

  const opacity = phase === "visible" || phase === "fading-out" ? 1 : 0;
  const shouldFadeOut = phase === "fading-out";

  return (
    <div
      className="fixed bg-black transition-opacity ease-in-out"
      style={{
        opacity: shouldFadeOut ? 0 : opacity,
        transitionDuration: `${duration / 2}ms`,
        zIndex: OVERLAY_Z_INDEX.PAGE_TRANSITION_OVERLAY,
        top: -100,
        left: 0,
        right: 0,
        bottom: -100,
        overscrollBehavior: "none",
        willChange: "opacity",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        touchAction: "none",
        overflow: "hidden",
      }}
    />
  );
};
