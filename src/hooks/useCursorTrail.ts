import { useContext } from 'react';
import { CursorTrailContext } from '../contexts/CursorTrailContext';

export const useCursorTrail = () => {
  const context = useContext(CursorTrailContext);
  if (!context) {
    throw new Error('useCursorTrail must be used within a CursorTrailProvider');
  }
  return context;
};