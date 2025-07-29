import { ROUTES } from "../constants/routes";

export interface PageConfig {
  showFooter: boolean;
  showNavbarLogo: boolean;
  navbarMode: 'overlay' | 'normal';
}

export const PAGE_CONFIGS: Record<string, PageConfig> = {
  [ROUTES.HOME]: {
    showFooter: false,
    showNavbarLogo: false,
    navbarMode: 'overlay',
  },
  [ROUTES.SHOWREEL]: {
    showFooter: false,
    showNavbarLogo: false,
    navbarMode: 'overlay',
  },
  [ROUTES.ABOUT]: {
    showFooter: true,
    showNavbarLogo: true,
    navbarMode: 'normal',
  },
  [ROUTES.PROJECTS]: {
    showFooter: true,
    showNavbarLogo: true,
    navbarMode: 'normal',
  },
  [ROUTES.CONTACT]: {
    showFooter: true,
    showNavbarLogo: true,
    navbarMode: 'normal',
  },
  [ROUTES.LEGAL]: {
    showFooter: true,
    showNavbarLogo: true,
    navbarMode: 'normal',
  },
};

export const DEFAULT_PAGE_CONFIG: PageConfig = {
  showFooter: true,
  showNavbarLogo: true,
  navbarMode: 'normal',
};

export const getPageConfig = (route: string): PageConfig => {
  // Handle dynamic project detail routes
  if (route.startsWith('/projects/') && route !== '/projects') {
    return {
      showFooter: false,
      showNavbarLogo: true,
      navbarMode: 'overlay',
    };
  }
  
  return PAGE_CONFIGS[route] || DEFAULT_PAGE_CONFIG;
};

