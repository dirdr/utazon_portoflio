import React from "react";
import { cn } from "../../utils/cn";

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glint";
  glintSpeed?: number;
  disabled?: boolean;
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

const buttonStyles = {
  base: "font-nord px-10 py-4 border border-[#565656] bg-foreground/5 text-foreground rounded-full hover:bg-foreground hover:text-background transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background inline-flex items-center justify-center",
  glint: "font-nord rounded-full glint-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
  glintInner: "inline-block px-10 py-4 bg-muted-foreground text-foreground rounded-full transition-colors duration-300",
  disabled: "opacity-50 cursor-not-allowed hover:bg-foreground/5 hover:text-foreground",
};

export const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    variant = "default",
    glintSpeed = 4,
    disabled = false,
    onClick,
  } = props;

  const glintStyle = variant === "glint" ? {
    "--glint-speed": `${glintSpeed}s`,
  } as React.CSSProperties : undefined;

  if (variant === "glint") {
    const combinedClasses = cn(
      buttonStyles.glint,
      disabled && buttonStyles.disabled,
      className
    );

    if (props.as === "button") {
      return (
        <button 
          className={combinedClasses} 
          style={glintStyle} 
          disabled={disabled}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
          type={props.type || "button"}
        >
          <span className={buttonStyles.glintInner}>
            {children}
          </span>
        </button>
      );
    }

    return (
      <a 
        className={combinedClasses} 
        style={glintStyle}
        aria-disabled={disabled}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        href={props.href}
        target={props.target}
        rel={props.rel}
      >
        <span className={buttonStyles.glintInner}>
          {children}
        </span>
      </a>
    );
  }

  const combinedClasses = cn(
    buttonStyles.base,
    disabled && buttonStyles.disabled,
    className
  );

  if (props.as === "button") {
    return (
      <button 
        className={combinedClasses} 
        disabled={disabled}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        type={props.type || "button"}
      >
        {children}
      </button>
    );
  }

  return (
    <a 
      className={combinedClasses}
      aria-disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      href={props.href}
      target={props.target}
      rel={props.rel}
    >
      {children}
    </a>
  );
};
