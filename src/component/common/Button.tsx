import React from "react";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
}

export const Button = ({
  children,
  href,
  className,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "font-nord px-10 py-4 border border-[#565656] bg-foreground/5 text-foreground rounded-full hover:bg-foreground hover:text-background transition-colors duration-300";

  const combinedClasses = [baseClasses, className].filter(Boolean).join(" ");

  return (
    <a href={href} className={combinedClasses} {...props}>
      {children}
    </a>
  );
};
