import { ROUTES } from "../constants/routes";

export interface PageConfig {
  showFooter: boolean;
  showNavbarLogo: boolean;
}

export const PAGE_CONFIGS: Record<string, PageConfig> = {
  [ROUTES.HOME]: {
    showFooter: false,
    showNavbarLogo: false,
  },
  [ROUTES.SHOWREEL]: {
    showFooter: false,
    showNavbarLogo: false,
  },
  [ROUTES.ABOUT]: {
    showFooter: true,
    showNavbarLogo: true,
  },
  [ROUTES.PROJECTS]: {
    showFooter: true,
    showNavbarLogo: true,
  },
  [ROUTES.CONTACT]: {
    showFooter: true,
    showNavbarLogo: true,
  },
  [ROUTES.LEGAL]: {
    showFooter: true,
    showNavbarLogo: true,
  },
};

export const DEFAULT_PAGE_CONFIG: PageConfig = {
  showFooter: true,
  showNavbarLogo: true,
};

export const getPageConfig = (route: string): PageConfig => {
  return PAGE_CONFIGS[route] || DEFAULT_PAGE_CONFIG;
};

