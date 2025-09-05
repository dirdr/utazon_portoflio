import { ReactNode } from "react";
import { TransitionContext, TransitionContextType } from "./TransitionContext";

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
