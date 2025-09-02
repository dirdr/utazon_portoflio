import { ReactNode, CSSProperties } from "react";
import { ANIMATION_CLASSES } from "../../constants/animations";

interface HomeFadeInContainerProps {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  instantForSPA?: boolean;
}

export const HomeFadeInContainer = ({
  children,
  isVisible,
  className = "",
  delay = 0,
  style = {},
  instantForSPA = false,
}: HomeFadeInContainerProps) => {
  // For SPA navigation, skip transitions entirely
  const baseClasses = instantForSPA ? "" : ANIMATION_CLASSES.TRANSITION;
  const visibilityClasses = isVisible
    ? ANIMATION_CLASSES.VISIBLE
    : ANIMATION_CLASSES.HIDDEN;

  const delayStyle =
    delay > 0 && !instantForSPA ? { transitionDelay: `${delay}ms` } : {};
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
