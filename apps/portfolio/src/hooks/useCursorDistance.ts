import { useCallback, useEffect, useRef, useState } from "react";

interface UseCursorDistanceOptions {
  maxDistance?: number;
  throttleMs?: number;
}

export const useCursorDistance = (
  targetRef: React.RefObject<HTMLElement | null>,
  options: UseCursorDistanceOptions = {},
) => {
  const { maxDistance = 200, throttleMs = 16 } = options;
  const [distance, setDistance] = useState(maxDistance);
  const [normalizedDistance, setNormalizedDistance] = useState(1);
  const frameRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef(0);

  const calculateDistance = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!targetRef.current) return maxDistance;

      const rect = targetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    [targetRef, maxDistance],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < throttleMs) return;

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const newDistance = calculateDistance(event.clientX, event.clientY);
        const clampedDistance = Math.min(newDistance, maxDistance);
        const normalized = 1 - clampedDistance / maxDistance;

        setDistance(clampedDistance);
        setNormalizedDistance(Math.max(0, normalized));
        lastUpdateRef.current = now;
      });
    },
    [calculateDistance, maxDistance, throttleMs],
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [handleMouseMove]);

  return {
    distance,
    normalizedDistance,
    intensity: normalizedDistance,
  };
};
