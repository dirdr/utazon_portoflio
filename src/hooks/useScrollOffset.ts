import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { useLocation } from "wouter";

export const useScrollOffset = () => {
  const [scrollY, setScrollY] = useState(0);
  const lenis = useLenis();
  const [location] = useLocation();

  useEffect(() => {
    setScrollY(0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, lenis]);

  useEffect(() => {
    if (lenis) {
      const handleLenisScroll = (e: { scroll: number }) => {
        setScrollY(e.scroll);
      };

      lenis.on("scroll", handleLenisScroll);
      return () => lenis.off("scroll", handleLenisScroll);
    } else {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [lenis]);

  return scrollY;
};
