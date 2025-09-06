import { useEffect, useRef, ReactNode, useMemo } from "react";
import Lenis from "lenis";
import { LenisContext, LenisScrollToOptions } from "./LenisContext";

interface LenisOptions {
  lerp?: number;
  duration?: number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

interface LenisProviderProps {
  children: ReactNode;
  options?: LenisOptions;
}

export const LenisProvider = ({
  children,
  options = {},
}: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  const defaultOptions = useMemo(() => ({
    lerp: 0.05,
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    ...options,
  }), [options]);

  const scrollTo = (target: string | number, options?: LenisScrollToOptions) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    }
  };

  const scrollToTop = () => {
    scrollTo(0, { duration: 0.6 });
  };

  useEffect(() => {
    lenisRef.current = new Lenis({
      ...defaultOptions,
      autoRaf: true,
    });

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [defaultOptions]);

  return (
    <LenisContext.Provider
      value={{
        lenis: lenisRef.current,
        scrollTo,
        scrollToTop,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
};

