import { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';

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

export const useCanvasReadiness = () => {
  const context = useContext(CanvasReadinessContext);
  if (!context) {
    throw new Error('useCanvasReadiness must be used within CanvasReadinessProvider');
  }
  return context;
};

export const useCanvasReadinessState = () => {
  const [canvasStates, setCanvasStates] = useState<Map<string, boolean>>(new Map());
  const listenersRef = useRef<Set<(allReady: boolean) => void>>(new Set());

  const notifyListeners = useCallback((allReady: boolean) => {
    listenersRef.current.forEach(callback => callback(allReady));
  }, []);

  const resetAllCanvases = useCallback(() => {
    setCanvasStates(new Map());
    setTimeout(() => notifyListeners(false), 0);
  }, [notifyListeners]);

  const registerCanvas = useCallback((id: string) => {
    setCanvasStates(prev => {
      const newMap = new Map(prev);
      if (!newMap.has(id)) {
        newMap.set(id, false);
        setTimeout(() => notifyListeners(false), 0);
      }
      return newMap;
    });
  }, [notifyListeners]);

  const markCanvasReady = useCallback((id: string) => {
    setCanvasStates(prev => {
      const newMap = new Map(prev);
      const wasReady = newMap.get(id);

      if (!wasReady) {
        newMap.set(id, true);
        const allReady = Array.from(newMap.values()).every(Boolean) && newMap.size > 0;
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

    const currentState = areAllCanvasesReady();
    callback(currentState);

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

export const useCanvasComponent = (canvasId: string) => {
  const { registerCanvas, markCanvasReady, markCanvasNotReady } = useCanvasReadiness();
  const hasRegistered = useRef(false);

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