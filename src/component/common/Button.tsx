import React from "react";
import { BUTTON_STYLES } from "../../constants/buttonStyles";

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
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

export const Button = (props: ButtonProps) => {
  const { children, className, disabled = false, onClick } = props;

  const combinedClasses = [
    BUTTON_STYLES.shared,
    BUTTON_STYLES.standard,
    disabled && BUTTON_STYLES.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
