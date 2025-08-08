import { ReactNode, CSSProperties } from "react";
import { ANIMATION_CLASSES } from "../../constants/animations";

interface FadeInContainerProps {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}

export const FadeInContainer = ({
  children,
  isVisible,
  className = "",
  delay = 0,
  style = {},
}: FadeInContainerProps) => {
  const baseClasses = ANIMATION_CLASSES.TRANSITION;
  const visibilityClasses = isVisible
    ? ANIMATION_CLASSES.VISIBLE
    : ANIMATION_CLASSES.HIDDEN;

  const delayStyle = delay > 0 ? { transitionDelay: `${delay}ms` } : {};
  const combinedStyle = { ...delayStyle, ...style };

  return (
    <div
      className={`${baseClasses} ${visibilityClasses} ${className}`}
      style={combinedStyle}
    >
      {children}
    </div>
  );
};
