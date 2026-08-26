import { useEffect, useState } from "react";

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

  return (
    <div
      className="page-transition-overlay"
      style={{ transitionDuration: `${duration / 2}ms` }}
      data-active={isActive}
      data-opaque={isOpaque}
    />
  );
};
