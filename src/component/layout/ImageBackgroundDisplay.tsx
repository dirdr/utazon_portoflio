import React, { useEffect } from "react";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { useRouteBackground } from "../../hooks/useRouteBackground";

export const ImageBackgroundDisplay: React.FC = () => {
  const routeBackground = useRouteBackground();
  const { currentBackground, nextBackground, isTransitioning, setBackgroundImage } = useBackgroundImageStore();

  useEffect(() => {
    setBackgroundImage(routeBackground, "ImageBackgroundDisplay");
    return () => setBackgroundImage(null, "ImageBackgroundDisplay");
  }, [routeBackground, setBackgroundImage]);
  
  // Skip load state check - assume preloaded assets are ready
  // Your preload system guarantees these images are cached
  const isCurrentReady = true;
  const isNextReady = true;

  // Don't render anything if no background is set
  if (!currentBackground && !nextBackground) {
    return null;
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: -20 }}>
      {/* Current background */}
      {currentBackground && (
        <div
          className={`
            absolute inset-0 
            transition-opacity duration-500 ease-in-out
            ${isTransitioning ? "opacity-0" : (isCurrentReady ? "opacity-100" : "opacity-0")}
          `}
          style={{
            backgroundImage: `url(${currentBackground.value})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* Next background for smooth transition */}
      {nextBackground && (
        <div
          className={`
            absolute inset-0 
            transition-opacity duration-500 ease-in-out
            ${isTransitioning && isNextReady ? "opacity-100" : "opacity-0"}
          `}
          style={{
            backgroundImage: `url(${nextBackground.value})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      )}
    </div>
  );
};

