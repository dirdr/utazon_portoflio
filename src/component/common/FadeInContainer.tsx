import { ReactNode } from "react";
import { ANIMATION_CLASSES } from "../../constants/animations";

interface FadeInContainerProps {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
  delay?: number;
}

export const FadeInContainer = ({
  children,
  isVisible,
  className = "",
  delay = 0,
}: FadeInContainerProps) => {
  const baseClasses = ANIMATION_CLASSES.TRANSITION;
  const visibilityClasses = isVisible
    ? ANIMATION_CLASSES.VISIBLE
    : ANIMATION_CLASSES.HIDDEN;

  const delayStyle = delay > 0 ? { transitionDelay: `${delay}ms` } : {};

  return (
    <div
      className={`${baseClasses} ${visibilityClasses} ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  );
};

