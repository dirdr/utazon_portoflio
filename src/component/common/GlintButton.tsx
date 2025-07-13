import React from "react";
import { cn } from "../../utils/cn";
import { BUTTON_STYLES } from "../../constants/buttonStyles";

interface BaseGlintButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  speed?: number;
}

interface LinkGlintButtonProps extends BaseGlintButtonProps {
  href: string;
  as?: "link";
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

interface ActionGlintButtonProps extends BaseGlintButtonProps {
  href?: never;
  as: "button";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

type GlintButtonProps = LinkGlintButtonProps | ActionGlintButtonProps;

export const GlintButton = (props: GlintButtonProps) => {
  const { children, className, disabled = false, speed = 2, onClick } = props;

  const wrapperClasses = cn(
    "glint-button-wrapper",
    disabled && "opacity-50",
    className,
  );

  const contentClasses = cn(
    "glint-button-content flex items-center justify-center transition-colors duration-300 hover:bg-button-hover",
    disabled && "cursor-not-allowed",
  );

  const textClasses = cn(
    BUTTON_STYLES.shared,
    "relative z-20 bg-transparent border-0 w-full h-full",
    disabled && BUTTON_STYLES.disabled,
  );

  const wrapperStyle = {
    "--animation-duration": `${speed}s`,
  } as React.CSSProperties;

  if (props.as === "button") {
    return (
      <div className={wrapperClasses} style={wrapperStyle}>
        <div className={contentClasses}>
          <button
            className={textClasses}
            disabled={disabled}
            onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
            type={props.type || "button"}
          >
            {children}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClasses} style={wrapperStyle}>
      <div className={contentClasses}>
        <a
          className={textClasses}
          aria-disabled={disabled}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
          href={props.href}
          target={props.target}
          rel={props.rel}
        >
          {children}
        </a>
      </div>
    </div>
  );
};
