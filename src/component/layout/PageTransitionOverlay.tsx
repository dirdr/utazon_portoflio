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
      className="fixed inset-0 bg-black transition-opacity ease-in-out h-dvh w-full"
      style={{
        opacity: shouldFadeOut ? 0 : opacity,
        transitionDuration: `${duration / 2}ms`,
        zIndex: OVERLAY_Z_INDEX.PAGE_TRANSITION_OVERLAY,
      }}
    />
  );
};

