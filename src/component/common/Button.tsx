import React, { useState, useRef, useMemo } from "react";
import { cn } from "../../utils/cn";
import { BUTTON_STYLES } from "../../constants/buttonStyles";
import { useCursorDistance } from "../../hooks/useCursorDistance";

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  glint?: boolean;
  glintOnHover?: boolean;
  speed?: number;
  proximityIntensity?: boolean;
  maxDistance?: number;
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  as?: "link";
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

interface ActionButtonProps extends BaseButtonProps {
  href?: never;
  as: "button";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

type ButtonProps = LinkButtonProps | ActionButtonProps;

const useGlintLogic = (
  glint: boolean,
  glintOnHover: boolean,
  proximityIntensity: boolean,
  isHovered: boolean,
) => {
  return useMemo(() => {
    const hasGlintFeature = glint || glintOnHover || proximityIntensity;
    const shouldShowGlint =
      glint || (glintOnHover && isHovered) || proximityIntensity;

    return { hasGlintFeature, shouldShowGlint };
  }, [glint, glintOnHover, proximityIntensity, isHovered]);
};

const useGlintStyles = (
  speed: number,
  proximityIntensity: boolean,
  intensity: number,
  shouldShowGlint: boolean,
) => {
  return useMemo(() => {
    if (!shouldShowGlint) return undefined;

    const baseOpacity = proximityIntensity ? 0.4 + intensity * 0.4 : 0.6;
    const peakOpacity = proximityIntensity ? 0.5 + intensity * 0.7 : 0.7;
    const scaleValue = proximityIntensity ? 1.2 + intensity * 0.5 : 1;

    return {
      "--animation-duration": `${speed}s`,
      "--glint-opacity": baseOpacity,
      "--glint-opacity-peak": peakOpacity,
      "--glint-scale": scaleValue,
    } as React.CSSProperties;
  }, [speed, proximityIntensity, intensity, shouldShowGlint]);
};

export const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    glint = false,
    glintOnHover = false,
    speed = 4,
    proximityIntensity = false,
    maxDistance = 150,
    onClick,
  } = props;

  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { intensity } = useCursorDistance(buttonRef, {
    maxDistance,
    throttleMs: 16,
  });

  const { hasGlintFeature, shouldShowGlint } = useGlintLogic(
    glint,
    glintOnHover,
    proximityIntensity,
    isHovered,
  );

  const wrapperStyle = useGlintStyles(
    speed,
    proximityIntensity,
    intensity,
    shouldShowGlint,
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const buttonClasses = cn(
    BUTTON_STYLES.base,
    shouldShowGlint && BUTTON_STYLES.glintOverrides,
    className,
  );

  const renderElement = () => {
    if (props.as === "button") {
      return (
        <button
          className={buttonClasses}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
          type={props.type || "button"}
        >
          {children}
        </button>
      );
    }

    return (
      <a
        className={buttonClasses}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        href={props.href}
        target={props.target}
        rel={props.rel}
      >
        {children}
      </a>
    );
  };

  if (!hasGlintFeature) {
    return renderElement();
  }

  const wrapperClasses = cn(shouldShowGlint && "glint-button-wrapper");
  const contentClasses = cn(
    shouldShowGlint && "glint-button-content",
    "flex items-center justify-center transition-colors duration-200 hover:bg-button-hover",
  );

  return (
    <div
      ref={buttonRef}
      className={wrapperClasses}
      style={wrapperStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {shouldShowGlint ? (
        <div className={contentClasses}>{renderElement()}</div>
      ) : (
        renderElement()
      )}
    </div>
  );
};
