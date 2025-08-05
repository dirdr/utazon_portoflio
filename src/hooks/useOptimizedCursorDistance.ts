import { useEffect, useRef, useState, useCallback } from 'react';
import { useCursorProximityContext } from '../contexts/CursorProximityContext';

interface UseOptimizedCursorDistanceOptions {
  maxDistance?: number;
  enabled?: boolean;
}

export const useOptimizedCursorDistance = (
  targetRef: React.RefObject<HTMLElement>,
  options: UseOptimizedCursorDistanceOptions = {}
) => {
  const { maxDistance = 200, enabled = true } = options;
  const [intensity, setIntensity] = useState(0);
  const { registerElement, unregisterElement } = useCursorProximityContext();
  const elementIdRef = useRef<string>();

  const handleIntensityChange = useCallback((newIntensity: number) => {
    setIntensity(newIntensity);
  }, []);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const elementId = `proximity-${Math.random().toString(36).substr(2, 9)}`;
    elementIdRef.current = elementId;

    registerElement(elementId, targetRef.current, maxDistance, handleIntensityChange);

    return () => {
      if (elementIdRef.current) {
        unregisterElement(elementIdRef.current);
      }
    };
  }, [enabled, maxDistance, registerElement, unregisterElement, handleIntensityChange]);

  // Update registration when target changes
  useEffect(() => {
    if (!enabled || !targetRef.current || !elementIdRef.current) return;

    registerElement(elementIdRef.current, targetRef.current, maxDistance, handleIntensityChange);
  }, [targetRef.current, maxDistance, enabled, registerElement, handleIntensityChange]);

  return {
    intensity,
    normalizedDistance: 1 - intensity,
    distance: maxDistance * (1 - intensity),
  };
};