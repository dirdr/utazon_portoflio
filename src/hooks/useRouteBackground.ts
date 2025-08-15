import { useLocation } from "wouter";
import backgroundImage from "../assets/images/background.webp";

const ROUTE_BACKGROUNDS: Record<string, string> = {
  "/": "", // Home page - no background
  "/about": "", // About page - solid black background
  "/projects": backgroundImage,
  "/contact": backgroundImage,
  "/showreel": backgroundImage,
  "/legal": backgroundImage,
};

export const useRouteBackground = () => {
  const [location] = useLocation();

  const getBackgroundForRoute = (path: string): string => {
    return ROUTE_BACKGROUNDS[path] || "";
  };

  return getBackgroundForRoute(location);
};

