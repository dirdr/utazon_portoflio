import { createContext } from "react";
import Lenis from "lenis";

export interface LenisScrollToOptions {
  offset?: number;
  lerp?: number;
  duration?: number;
  easing?: (t: number) => number;
  force?: boolean;
  lock?: boolean;
  onComplete?: () => void;
}

export interface LenisContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | number, options?: LenisScrollToOptions) => void;
  scrollToTop: () => void;
}

export const LenisContext = createContext<LenisContextValue | null>(null);