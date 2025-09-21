import React from "react";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";

export const ImageBackgroundDisplay: React.FC = () => {
  const { currentBackground, nextBackground, isTransitioning } = useBackgroundImageStore();

  // useTransitionRouter already handles background setting and cache verification
  // This component only displays the backgrounds that are already verified and ready
  const isCurrentReady = true; // Already verified by useTransitionRouter
  const isNextReady = true; // Already verified by useTransitionRouter

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

