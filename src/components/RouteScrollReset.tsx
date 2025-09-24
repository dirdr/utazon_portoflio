import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLenis } from 'lenis/react';

export const RouteScrollReset = () => {
  const [location] = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    lenis?.scrollTo(0, { immediate: true });
  }, [location, lenis]);

  return null;
};