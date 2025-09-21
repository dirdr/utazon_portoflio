import { useLocation } from "wouter";
import backgroundImage from "../assets/images/background.webp";
import backgroundMobileImage from "../assets/images/background_mobile.png";
import { isMobile } from "../utils/mobileDetection";

const ROUTE_BACKGROUNDS: Record<string, string> = {
  "/": "", // Home page - no background
  "/about": "", // About page - solid black background
  "/projects": "", // Will be determined by device type
  "/contact": "", // Will be determined by device type
  "/showreel": "", // Will be determined by device type
  "/legal": "", // Will be determined by device type
};

export const useRouteBackground = () => {
  const [location] = useLocation();

  const getBackgroundForRoute = (path: string): string => {
    const routeBackground = ROUTE_BACKGROUNDS[path];

    // Return empty string for routes that explicitly don't need backgrounds
    if (routeBackground === "") {
      // For routes that need background images, determine by device type
      if (path === "/projects" || path === "/contact" || path === "/showreel" || path === "/legal") {
        return isMobile() ? backgroundMobileImage : backgroundImage;
      }
      return "";
    }

    return routeBackground || "";
  };

  return getBackgroundForRoute(location);
};

