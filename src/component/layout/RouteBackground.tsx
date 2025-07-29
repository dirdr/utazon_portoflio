import React from "react";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { useRouteBackground } from "../../hooks/useRouteBackground";
import { useEffect } from "react";

export const RouteBackground: React.FC = () => {
  const routeBackground = useRouteBackground();
  const { currentBackground, nextBackground, isTransitioning, setBackgroundImage } = useBackgroundStore();

  useEffect(() => {
    setBackgroundImage(routeBackground, "RouteBackground");
    return () => setBackgroundImage(null, "RouteBackground");
  }, [routeBackground, setBackgroundImage]);

  return (
    <>
      {currentBackground && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-out"
          style={{
            zIndex: -2,
            backgroundImage: `url(${currentBackground})`,
            opacity: isTransitioning ? 0 : 1,
          }}
        />
      )}
      {nextBackground && isTransitioning && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-out"
          style={{
            zIndex: -1,
            backgroundImage: `url(${nextBackground})`,
            opacity: 1,
          }}
        />
      )}
    </>
  );
};

