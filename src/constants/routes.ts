export const ROUTES = {
  HOME: "/",
  ABOUT: "/about", 
  PROJECTS: "/projects",
  CONTACT: "/contact",
  SHOWREEL: "/showreel",
} as const;

export const NAVIGATION_ITEMS = [
  { label: "PROJETS", href: ROUTES.PROJECTS },
  { label: "À PROPOS", href: ROUTES.ABOUT },
] as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];