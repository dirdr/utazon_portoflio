import React from "react";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";

export const ImageBackgroundDisplay: React.FC = () => {
  const { currentBackground, nextBackground, isTransitioning } = useBackgroundImageStore();

  const isCurrentReady = true;
  const isNextReady = true;

  if (!currentBackground && !nextBackground) {
    return null;
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: -20 }}>
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

