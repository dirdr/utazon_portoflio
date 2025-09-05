import { useEffect, useState } from 'react';

interface PageTransitionOverlayProps {
  isTransitioning: boolean;
  duration: number;
  onFadeInComplete?: () => void;
}

export const PageTransitionOverlay = ({
  isTransitioning,
  duration,
  onFadeInComplete,
}: PageTransitionOverlayProps) => {
  const [phase, setPhase] = useState<'hidden' | 'fading-in' | 'visible' | 'fading-out'>('hidden');

  useEffect(() => {
    if (isTransitioning && phase === 'hidden') {
      // Start fade in
      setPhase('fading-in');
      
      // Use setTimeout instead of requestAnimationFrame for consistent timing
      setTimeout(() => {
        setPhase('visible');
        
        // Notify when fade-in completes
        setTimeout(() => {
          onFadeInComplete?.();
        }, duration / 2);
      }, 16); // One frame delay to ensure CSS transition starts
    } else if (!isTransitioning && phase === 'visible') {
      // Start fade out (scroll was already reset during route switch)
      setPhase('fading-out');
      
      // Hide overlay after fade-out completes
      setTimeout(() => {
        setPhase('hidden');
      }, duration / 2);
    }
  }, [isTransitioning, phase, duration, onFadeInComplete]);

  if (phase === 'hidden') return null;

  const opacity = phase === 'visible' || phase === 'fading-out' ? 1 : 0;
  const shouldFadeOut = phase === 'fading-out';

  return (
    <div
      className="fixed inset-0 z-50 bg-black transition-opacity ease-in-out"
      style={{
        opacity: shouldFadeOut ? 0 : opacity,
        transitionDuration: `${duration / 2}ms`,
      }}
    />
  );
};