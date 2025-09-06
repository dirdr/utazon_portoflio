import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";

interface LenisOptions {
  lerp?: number;
  duration?: number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

interface LenisContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | number, options?: any) => void;
  scrollToTop: () => void;
}

const LenisContext = createContext<LenisContextValue | null>(null);

export const useLenis = () => {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error("useLenis must be used within LenisProvider");
  }
  return context;
};

interface LenisProviderProps {
  children: ReactNode;
  options?: LenisOptions;
}

export const LenisProvider = ({ 
  children, 
  options = {} 
}: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  const defaultOptions = {
    lerp: 0.05,
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    ...options
  };

  const scrollTo = (target: string | number, options?: any) => {
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
      autoRaf: true
    });

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <LenisContext.Provider value={{
      lenis: lenisRef.current,
      scrollTo,
      scrollToTop
    }}>
      {children}
    </LenisContext.Provider>
  );
};