import { createContext, ReactNode } from "react";

export interface TransitionContextType {
  navigateWithTransition: (
    location: string,
    routeParams?: Record<string, string>,
  ) => Promise<void>;
  navigate: (location: string) => void;
  isTransitioning: boolean;
  currentLocation: string;
}

export const TransitionContext = createContext<TransitionContextType | null>(
  null,
);

interface TransitionProviderProps {
  children: ReactNode;
  value: TransitionContextType;
}

export const TransitionProvider = ({
  children,
  value,
}: TransitionProviderProps) => (
  <TransitionContext.Provider value={value}>
    {children}
  </TransitionContext.Provider>
);

