import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants/routes";

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

export const NavLink = ({ href, label, onClick, className = "" }: NavLinkProps) => {
  const { t } = useTranslation();
  
  return (
    <a
      href={href}
      onClick={onClick}
      className={`hover:text-muted font-nord transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-sm ${className}`}
    >
      {getNavLabel(href, t) || label}
    </a>
  );
};