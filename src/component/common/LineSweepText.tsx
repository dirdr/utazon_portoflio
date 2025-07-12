import React, { ReactNode } from "react";

interface LineSweepTextProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  animate?: boolean;
}

export const LineSweepText: React.FC<LineSweepTextProps> = ({
  children,
  className = "",
  duration = 2,
  animate = true,
}) => {
  if (!animate) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Base text with reduced opacity */}
      <span className="opacity-50">{children}</span>

      {/* Animated light sweep overlay */}
      <span
        className="absolute inset-0 text-white"
        style={{
          background: `linear-gradient(90deg, transparent 30%, white 50%, transparent 70%)`,
          backgroundSize: "200% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          animation: `lightSweep ${duration}s linear infinite`,
        }}
      >
        {children}
      </span>
    </span>
  );
};
