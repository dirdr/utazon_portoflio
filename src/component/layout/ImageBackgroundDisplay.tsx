import React from "react";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { useImageLoadState } from "../../hooks/useImageLoadState";

export const ImageBackgroundDisplay: React.FC = () => {
  const { currentBackground, nextBackground, isTransitioning } = useBackgroundStore();
  
  // Use the bridge hook to leverage existing preload system
  const currentBgLoadState = useImageLoadState(currentBackground || "");
  const nextBgLoadState = useImageLoadState(nextBackground || "");
  
  const isCurrentReady = !currentBackground || currentBgLoadState.isLoaded;
  const isNextReady = !nextBackground || nextBgLoadState.isLoaded;

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
            transition-opacity duration-300 ease-in-out
            ${isTransitioning ? "opacity-0" : (isCurrentReady ? "opacity-100" : "opacity-0")}
          `}
          style={{
            backgroundImage: `url(${currentBackground})`,
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
            transition-opacity duration-300 ease-in-out
            ${isTransitioning && isNextReady ? "opacity-100" : "opacity-0"}
          `}
          style={{
            backgroundImage: `url(${nextBackground})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      )}
    </div>
  );
};

