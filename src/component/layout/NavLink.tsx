import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants/routes";
import { useTransitionContext } from "../../hooks/useTransitionContext";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

const getNavLabel = (href: string, t: (key: string) => string): string => {
  switch (href) {
    case ROUTES.PROJECTS:
      return t("nav.projects");
    case ROUTES.ABOUT:
      return t("nav.about");
    default:
      return href;
  }
};

export const NavLink = ({
  href,
  label,
  onClick,
  className = "",
}: NavLinkProps) => {
  const { t } = useTranslation();
  const { navigateWithTransition } = useTransitionContext();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Execute transition - route assets determined automatically
    await navigateWithTransition(href);
    
    // Call original onClick if provided
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`hover:text-muted font-nord transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm xl:text-sm 2xl:text-base cursor-pointer ${className}`}
    >
      {getNavLabel(href, t) || label}
    </a>
  );
};
