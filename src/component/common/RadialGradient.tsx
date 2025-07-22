import React from "react";
import { cn } from "../../utils/cn";

interface RadialGradientProps {
  size?: number;
  opacity?: number;
  className?: string;
  centerColor?: string;
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
