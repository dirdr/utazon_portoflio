import React, { ReactNode } from "react";

interface SmoothTransitionTextProps {
  children: ReactNode;
  className?: string;
  baseColor?: string;
  hoverColor?: string;
  isHovered?: boolean;
  showLineSweep?: boolean;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export const SmoothTransitionText: React.FC<SmoothTransitionTextProps> = ({
  children,
  className = "",
  baseColor = "text-white",
  hoverColor = "text-muted",
  isHovered = false,
  showLineSweep = false,
  duration = 6,
  as: Component = "span",
}) => {
  return (
    <Component 
      className={`relative inline-block transition-colors duration-300 ${
        isHovered ? hoverColor : baseColor
      } ${className}`}
    >
      {/* Base text */}
      <span className="relative z-10">{children}</span>

      {/* Line sweep overlay - only visible when hovered and showLineSweep is true */}
      {isHovered && showLineSweep && (
        <span
          className="absolute inset-0 text-white z-20 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, white 20%, transparent 40%)`,
            backgroundSize: "300% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: `lightSweep ${duration}s linear infinite`,
          }}
        >
          {children}
        </span>
      )}
    </Component>
  );
};