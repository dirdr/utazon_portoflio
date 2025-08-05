import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react';

interface ProximityElement {
  id: string;
  element: HTMLElement;
  maxDistance: number;
  callback: (intensity: number) => void;
}

interface CursorProximityContextType {
  registerElement: (
    id: string,
    element: HTMLElement,
    maxDistance: number,
    callback: (intensity: number) => void
  ) => void;
  unregisterElement: (id: string) => void;
}

const CursorProximityContext = createContext<CursorProximityContextType | null>(null);

export const CursorProximityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const elementsRef = useRef<Map<string, ProximityElement>>(new Map());
  const frameRef = useRef<number>();
  const lastUpdateRef = useRef(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const calculateProximities = useCallback(() => {
    const { x: mouseX, y: mouseY } = mousePositionRef.current;
    const elements = elementsRef.current;

    // Batch DOM reads
    const elementData = Array.from(elements.values()).map(({ element, maxDistance, callback, id }) => {
      const rect = element.getBoundingClientRect();
      return {
        id,
        callback,
        maxDistance,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };
    });

    // Batch calculations and updates
    elementData.forEach(({ callback, maxDistance, centerX, centerY }) => {
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const clampedDistance = Math.min(distance, maxDistance);
      const intensity = Math.max(0, 1 - (clampedDistance / maxDistance));
      
      callback(intensity);
    });
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const now = performance.now();
    
    // Update mouse position immediately
    mousePositionRef.current = { x: event.clientX, y: event.clientY };
    
    // Throttle calculations (60fps = ~16.67ms)
    if (now - lastUpdateRef.current < 16.67) return;
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      calculateProximities();
      lastUpdateRef.current = now;
    });
  }, [calculateProximities]);

  const registerElement = useCallback((
    id: string,
    element: HTMLElement,
    maxDistance: number,
    callback: (intensity: number) => void
  ) => {
    elementsRef.current.set(id, { id, element, maxDistance, callback });
  }, []);

  const unregisterElement = useCallback((id: string) => {
    elementsRef.current.delete(id);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [handleMouseMove]);

  return (
    <CursorProximityContext.Provider value={{ registerElement, unregisterElement }}>
      {children}
    </CursorProximityContext.Provider>
  );
};

export const useCursorProximityContext = () => {
  const context = useContext(CursorProximityContext);
  if (!context) {
    throw new Error('useCursorProximityContext must be used within a CursorProximityProvider');
  }
  return context;
};