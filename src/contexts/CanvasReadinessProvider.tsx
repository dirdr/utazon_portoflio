import React from 'react';
import { CanvasReadinessContext, useCanvasReadinessState } from '../hooks/useCanvasReadiness';

interface CanvasReadinessProviderProps {
  children: React.ReactNode;
}

export const CanvasReadinessProvider: React.FC<CanvasReadinessProviderProps> = ({ children }) => {
  const canvasReadinessState = useCanvasReadinessState();

  return (
    <CanvasReadinessContext.Provider value={canvasReadinessState}>
      {children}
    </CanvasReadinessContext.Provider>
  );
};