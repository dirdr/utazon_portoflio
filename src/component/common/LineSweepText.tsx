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
  duration = 6,
  animate = true,
}) => {
  if (!animate) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="">{children}</span>

      <span
        className="absolute inset-0 text-white"
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
    </span>
  );
};
