import React, { createContext, useContext, ReactNode } from 'react';
import { useLocomotiveScroll, LocomotiveScrollOptions } from '../hooks/useLocomotiveScroll';
import LocomotiveScroll from 'locomotive-scroll';

interface LocomotiveScrollContextValue {
  scrollRef: React.RefObject<HTMLDivElement>;
  scroll: LocomotiveScroll | null;
  updateScroll: () => void;
  scrollTo: (target: string | number, options?: object) => void;
  scrollToTop: () => void;
  destroyScroll: () => void;
}

const LocomotiveScrollContext = createContext<LocomotiveScrollContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useLocomotiveScrollContext = () => {
  const context = useContext(LocomotiveScrollContext);
  if (!context) {
    throw new Error('useLocomotiveScrollContext must be used within LocomotiveScrollProvider');
  }
  return context;
};

interface LocomotiveScrollProviderProps {
  children: ReactNode;
  options?: LocomotiveScrollOptions;
  dependencies?: unknown[];
  className?: string;
}

export const LocomotiveScrollProvider: React.FC<LocomotiveScrollProviderProps> = ({
  children,
  options = {},
  dependencies = [],
  className = '',
}) => {
  const locomotiveScroll = useLocomotiveScroll(options, dependencies);

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