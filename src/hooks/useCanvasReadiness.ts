import { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';

// Context for Canvas readiness coordination
interface CanvasReadinessContextType {
  registerCanvas: (id: string) => void;
  markCanvasReady: (id: string) => void;
  markCanvasNotReady: (id: string) => void;
  isCanvasReady: (id: string) => boolean;
  areAllCanvasesReady: () => boolean;
  onCanvasReadyChange: (callback: (allReady: boolean) => void) => () => void;
  resetAllCanvases: () => void;
}

export const CanvasReadinessContext = createContext<CanvasReadinessContextType | null>(null);

// Hook for components to interact with Canvas readiness
export const useCanvasReadiness = () => {
  const context = useContext(CanvasReadinessContext);
  if (!context) {
    throw new Error('useCanvasReadiness must be used within CanvasReadinessProvider');
  }
  return context;
};

// Hook for managing Canvas readiness state (for provider)
export const useCanvasReadinessState = () => {
  const [canvasStates, setCanvasStates] = useState<Map<string, boolean>>(new Map());
  const listenersRef = useRef<Set<(allReady: boolean) => void>>(new Set());

  const notifyListeners = useCallback((allReady: boolean) => {
    listenersRef.current.forEach(callback => callback(allReady));
  }, []);

  // Reset all canvas states (for route transitions)
  const resetAllCanvases = useCallback(() => {
    console.log('🔄 Resetting all canvas states for new route');
    setCanvasStates(new Map());
    // Notify listeners that no canvases are ready after reset
    setTimeout(() => notifyListeners(false), 0);
  }, [notifyListeners]);

  const registerCanvas = useCallback((id: string) => {
    setCanvasStates(prev => {
      const newMap = new Map(prev);
      if (!newMap.has(id)) {
        newMap.set(id, false);
        // Notify that we now have a canvas that's not ready
        setTimeout(() => notifyListeners(false), 0);
      }
      return newMap;
    });
  }, [notifyListeners]);

  const markCanvasReady = useCallback((id: string) => {
    console.log('🎯 Canvas marked ready:', id);
    setCanvasStates(prev => {
      const newMap = new Map(prev);
      const wasReady = newMap.get(id);

      if (!wasReady) {
        newMap.set(id, true);

        // Check if all canvases are now ready
        const allReady = Array.from(newMap.values()).every(Boolean) && newMap.size > 0;
        console.log('🏁 All canvases ready check:', {
          canvasId: id,
          allReady,
          totalCanvases: newMap.size,
          states: Object.fromEntries(newMap)
        });
        setTimeout(() => notifyListeners(allReady), 0);
      }

      return newMap;
    });
  }, [notifyListeners]);

  const markCanvasNotReady = useCallback((id: string) => {
    setCanvasStates(prev => {
      const newMap = new Map(prev);
      const wasReady = newMap.get(id);

      if (wasReady) {
        newMap.set(id, false);
        setTimeout(() => notifyListeners(false), 0);
      }

      return newMap;
    });
  }, [notifyListeners]);

  const isCanvasReady = useCallback((id: string) => {
    return canvasStates.get(id) ?? false;
  }, [canvasStates]);

  const areAllCanvasesReady = useCallback(() => {
    return Array.from(canvasStates.values()).every(Boolean) && canvasStates.size > 0;
  }, [canvasStates]);

  const onCanvasReadyChange = useCallback((callback: (allReady: boolean) => void) => {
    listenersRef.current.add(callback);

    // Immediately call with current state
    const currentState = areAllCanvasesReady();
    callback(currentState);

    // Return cleanup function
    return () => {
      listenersRef.current.delete(callback);
    };
  }, [areAllCanvasesReady]);

  return {
    registerCanvas,
    markCanvasReady,
    markCanvasNotReady,
    isCanvasReady,
    areAllCanvasesReady,
    onCanvasReadyChange,
    resetAllCanvases,
  };
};

// Hook for individual Canvas components to report their readiness
export const useCanvasComponent = (canvasId: string) => {
  const { registerCanvas, markCanvasReady, markCanvasNotReady } = useCanvasReadiness();
  const hasRegistered = useRef(false);

  // Register this canvas on mount using useEffect
  useEffect(() => {
    if (!hasRegistered.current) {
      registerCanvas(canvasId);
      hasRegistered.current = true;
    }
  }, [canvasId, registerCanvas]);

  const setReady = useCallback(() => {
    markCanvasReady(canvasId);
  }, [canvasId, markCanvasReady]);

  const setNotReady = useCallback(() => {
    markCanvasNotReady(canvasId);
  }, [canvasId, markCanvasNotReady]);

  return { setReady, setNotReady };
};