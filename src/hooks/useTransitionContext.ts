import { useContext } from 'react';
import { TransitionContext, TransitionContextType } from '../contexts/TransitionContext';

export const useTransitionContext = (): TransitionContextType => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransitionContext must be used within a TransitionProvider');
  }
  return context;
};