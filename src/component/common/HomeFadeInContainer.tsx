import { ReactNode, CSSProperties, useEffect, useRef, useMemo } from "react";
import { ANIMATION_CLASSES } from "../../constants/animations";

interface HomeFadeInContainerProps {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  instantForSPA?: boolean;
  transitionDuration?: number; // Custom duration in ms
}

export const HomeFadeInContainer = ({
  children,
  isVisible,
  className = "",
  delay = 0,
  style = {},
  instantForSPA = false,
  transitionDuration,
}: HomeFadeInContainerProps) => {
  const baseClasses = instantForSPA 
    ? "" 
    : transitionDuration 
      ? "transition-opacity ease-in-out" // Use custom duration, skip default
      : ANIMATION_CLASSES.TRANSITION;
  const visibilityClasses = isVisible
    ? ANIMATION_CLASSES.VISIBLE
    : ANIMATION_CLASSES.HIDDEN;

  const combinedStyle = useMemo(() => {
    const delayStyle =
      delay > 0 && !instantForSPA ? { transitionDelay: `${delay}ms` } : {};
    const durationStyle = 
      transitionDuration && !instantForSPA ? { transitionDuration: `${transitionDuration}ms` } : {};
    return { ...delayStyle, ...durationStyle, ...style };
  }, [delay, instantForSPA, transitionDuration, style]);

  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (isVisible) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        console.log('🎭 HomeFadeInContainer: Starting fade-in', {
          delay,
          transitionDuration,
          instantForSPA,
          baseClasses,
          visibilityClasses,
          combinedStyle,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } else {
      startTimeRef.current = undefined;
      console.log('🎭 HomeFadeInContainer: Hidden', {
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }, [isVisible, delay, transitionDuration, instantForSPA, baseClasses, visibilityClasses, combinedStyle]);

  return (
    <div
      className={`${baseClasses} ${visibilityClasses} ${className}`}
      style={combinedStyle}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget) { // Only log for this element, not children
          console.log('🎭 HomeFadeInContainer: Transition ENDED', {
            totalTime: startTimeRef.current ? Date.now() - startTimeRef.current : 'unknown',
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }}
    >
      {children}
    </div>
  );
};
