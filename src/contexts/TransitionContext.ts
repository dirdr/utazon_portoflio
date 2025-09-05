import { createContext } from 'react';

export interface TransitionContextType {
  navigateWithTransition: (location: string, routeParams?: Record<string, string>) => Promise<void>;
  navigate: (location: string) => void;
  isTransitioning: boolean;
  currentLocation: string;
}

export const TransitionContext = createContext<TransitionContextType | null>(null);