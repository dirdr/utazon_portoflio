import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { BUTTON_STYLES } from "../../constants/buttonStyles";

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  glint?: boolean;
  glintOnHover?: boolean;
  speed?: number;
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

export const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    glint = false,
    glintOnHover = false,
    speed = 2,
    onClick,
  } = props;
  const [isHovered, setIsHovered] = useState(false);

  const shouldShowGlint = glint || (glintOnHover && isHovered);
  const hasGlintFeature = glint || glintOnHover;

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

  const wrapperStyle = shouldShowGlint
    ? ({
        "--animation-duration": `${speed}s`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div
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
