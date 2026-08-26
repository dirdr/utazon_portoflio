export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PROJECTS: "/projects",
  LEGAL: "/legal",
} as const;

export const NAVIGATION_ITEMS = [
  { label: "PROJETS", href: ROUTES.PROJECTS },
  { label: "à PROPOS", href: ROUTES.ABOUT },
] as const;

export type RouteKey = keyof typeof ROUTES;
