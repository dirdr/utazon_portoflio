import { createContext, useContext, ReactNode } from 'react';

interface TransitionContextType {
  navigateWithTransition: (location: string, routeParams?: Record<string, string>) => Promise<void>;
  navigate: (location: string) => void;
  isTransitioning: boolean;
  currentLocation: string;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

interface TransitionProviderProps {
  children: ReactNode;
  value: TransitionContextType;
}

export const TransitionProvider = ({ children, value }: TransitionProviderProps) => (
  <TransitionContext.Provider value={value}>
    {children}
  </TransitionContext.Provider>
);

export const useTransitionContext = (): TransitionContextType => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransitionContext must be used within a TransitionProvider');
  }
  return context;
};