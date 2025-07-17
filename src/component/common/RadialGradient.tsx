import React from "react";
import { cn } from "../../utils/cn";

interface RadialGradientProps {
  /**
   * Size of the radial gradient in percentage (e.g., 50 for 50%)
   * Controls how far the bright center extends before fading to dark
   */
  size?: number;
  /**
   * Opacity of the gradient overlay (0-1)
   */
  opacity?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Center color (bright)
   */
  centerColor?: string;
  /**
   * Edge color (dark)
   */
  edgeColor?: string;
}

export const RadialGradient: React.FC<RadialGradientProps> = ({
  size = 40,
  opacity = 0.6,
  className,
  centerColor = "transparent",
  edgeColor = "rgba(0, 0, 0, 0.8)",
}) => {
  const gradientStyle = {
    background: `radial-gradient(circle, ${centerColor} 0%, ${centerColor} ${size}%, ${edgeColor} 100%)`,
    opacity,
  };

  return (
    <div
      className={cn("pointer-events-none z-10", className)}
      style={gradientStyle}
      aria-hidden="true"
    />
  );
};

