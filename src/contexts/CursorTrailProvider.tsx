import React, { useState, useCallback } from 'react';
import { CursorTrailContext, type CursorTrailContextValue } from './CursorTrailContext';

interface CursorTrailProviderProps {
  children: React.ReactNode;
}

export const CursorTrailProvider: React.FC<CursorTrailProviderProps> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const enableTrail = useCallback(() => {
    setIsEnabled(true);
  }, []);

  const disableTrail = useCallback(() => {
    setIsEnabled(false);
  }, []);

  const setTrailEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
  }, []);

  const value: CursorTrailContextValue = {
    isEnabled,
    enableTrail,
    disableTrail,
    setTrailEnabled,
  };

  return (
    <CursorTrailContext.Provider value={value}>
      {children}
    </CursorTrailContext.Provider>
  );
};