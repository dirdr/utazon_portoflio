import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants/routes";
import { useTransitionContext } from "../../hooks/useTransitionContext";
import { useAssetPrefetch } from "../../contexts/AssetPrefetchContext";
import { getRouteVideoKeys } from "../../config/routeAssets";

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
  const { prefetchVideos } = useAssetPrefetch();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Execute transition - route assets determined automatically
    await navigateWithTransition(href);

    // Call original onClick if provided
    onClick?.();
  };

  const handleMouseEnter = () => {
    // Prefetch all project videos when hovering over Projects nav link
    if (href === ROUTES.PROJECTS) {
      const videoKeys = getRouteVideoKeys(href);
      if (videoKeys.length > 0) {
        prefetchVideos(videoKeys, "medium").catch((error) => {
          console.error("Failed to prefetch projects videos:", error);
        });
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`cursor-pointer rounded-sm ButtonText font-nord transition-colors hover:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {getNavLabel(href, t) || label}
    </a>
  );
};
