import React, { createContext, useContext, ReactNode, useMemo, useRef } from "react";
import {
  useLocomotiveScroll,
  LocomotiveScrollOptions,
} from "../hooks/useLocomotiveScroll";
import LocomotiveScroll from "locomotive-scroll";

interface LocomotiveScrollContextValue {
  scrollRef: React.RefObject<HTMLDivElement>;
  scroll: LocomotiveScroll | null;
  updateScroll: () => void;
  scrollTo: (target: string | number, options?: object) => void;
  scrollToTop: () => void;
  destroyScroll: () => void;
}

const LocomotiveScrollContext =
  createContext<LocomotiveScrollContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useLocomotiveScrollContext = () => {
  const context = useContext(LocomotiveScrollContext);
  if (!context) {
    throw new Error(
      "useLocomotiveScrollContext must be used within LocomotiveScrollProvider",
    );
  }
  return context;
};

interface LocomotiveScrollProviderProps {
  children: ReactNode;
  options?: LocomotiveScrollOptions;
  dependencies?: unknown[];
  className?: string;
}

export const LocomotiveScrollProvider: React.FC<
  LocomotiveScrollProviderProps
> = ({ children, options = {}, dependencies = [], className = "" }) => {
  // Create stable references that only change when content actually changes
  const prevOptionsRef = useRef<LocomotiveScrollOptions>();
  const prevDependenciesRef = useRef<unknown[]>();
  
  const stableOptions = useMemo(() => {
    // Deep comparison for options
    const optionsChanged = !prevOptionsRef.current || 
      JSON.stringify(prevOptionsRef.current) !== JSON.stringify(options);
    
    if (optionsChanged) {
      prevOptionsRef.current = options;
    }
    
    return prevOptionsRef.current;
  }, [options]);
  
  const stableDependencies = useMemo(() => {
    // Shallow comparison for dependencies array
    const depsChanged = !prevDependenciesRef.current ||
      prevDependenciesRef.current.length !== dependencies.length ||
      prevDependenciesRef.current.some((dep, index) => dep !== dependencies[index]);
    
    if (depsChanged) {
      prevDependenciesRef.current = dependencies;
    }
    
    return prevDependenciesRef.current;
  }, [dependencies]);
  
  const locomotiveScroll = useLocomotiveScroll(stableOptions, stableDependencies);

  return (
    <LocomotiveScrollContext.Provider value={locomotiveScroll}>
      <div
        ref={locomotiveScroll.scrollRef}
        data-scroll-container
        className={className}
      >
        {children}
      </div>
    </LocomotiveScrollContext.Provider>
  );
};

