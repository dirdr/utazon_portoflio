import { useIsMobileSimple } from "./useIsMobile";

export const useIsMobileHome = (): boolean => {
  return useIsMobileSimple({
    breakpoint: 1024,
    treatTabletsAsMobile: true,
  });
};

