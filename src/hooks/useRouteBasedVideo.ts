import { useLocation } from "wouter";

export const useRouteBasedVideo = () => {
  const [location] = useLocation();

  const shouldPlayVideo = location === "/";
  const shouldShowLayout = location !== "/";

  return {
    shouldPlayVideo,
    shouldShowLayout,
    currentPath: location,
  };
};

