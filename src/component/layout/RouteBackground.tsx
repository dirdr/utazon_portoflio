import React from "react";
import { useRouteBackground } from "../../hooks/useRouteBackground";

export const RouteBackground: React.FC = () => {
  const backgroundImage = useRouteBackground();

  if (!backgroundImage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 transition-opacity duration-300 ease-in-out"
      style={{
        zIndex: -1,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );
};

