import { useIsMobileSimple } from "./useIsMobile";

export const useHomeMobileBreakpoint = (): boolean => {
  return useIsMobileSimple({
    breakpoint: 1024,
    treatTabletsAsMobile: true,
  });
};

