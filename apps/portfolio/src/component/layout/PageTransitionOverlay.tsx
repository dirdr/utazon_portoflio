import { useEffect, useRef, useState } from "react";
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

  const visibleSinceRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const fadeMs = duration / 2;
  // Mirrors the router's black-screen floor, so a route that resolves instantly
  // still reads as a deliberate fade rather than a flicker.
  const minVisibleMs = duration / 3;

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };
  }, []);

  useEffect(() => {
    if (isTransitioning && phase === "hidden") {
      setPhase("fading-in");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          visibleSinceRef.current = Date.now();
          setPhase("visible");
        });
      });
      return;
    }

    if (!isTransitioning && phase === "visible") {
      const held = Date.now() - visibleSinceRef.current;
      const wait = Math.max(0, minVisibleMs - held);

      const start = setTimeout(() => {
        setPhase("fading-out");
        const end = setTimeout(() => setPhase("hidden"), fadeMs);
        timersRef.current.push(end);
      }, wait);

      timersRef.current.push(start);
    }
  }, [isTransitioning, phase, fadeMs, minVisibleMs]);

  useEffect(() => {
    if (phase === "visible") {
      const timer = setTimeout(() => onFadeInComplete?.(), fadeMs);
      return () => clearTimeout(timer);
    }
  }, [phase, fadeMs, onFadeInComplete]);

  const isOpaque = phase === "visible";
  const isActive = phase !== "hidden";

  // Portalled to the body so no ancestor can become its containing block. A
  // transform or filter anywhere above would re-anchor this fixed element to
  // that box and let the page show through around it.
  return createPortal(
    <div
      className="page-transition-overlay"
      style={{ transitionDuration: `${fadeMs}ms` }}
      data-active={isActive}
      data-opaque={isOpaque}
    />,
    document.body,
  );
};
