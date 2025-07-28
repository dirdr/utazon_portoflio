import React, { useEffect, useState } from "react";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";

export const ImageBackgroundDisplay: React.FC = () => {
  const { currentBackground, nextBackground, isTransitioning } = useBackgroundStore();
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());


  // Preload images to prevent flicker
  useEffect(() => {
    const imagesToPreload = [currentBackground, nextBackground].filter(Boolean);
    
    imagesToPreload.forEach((imageUrl) => {
      if (imageUrl && !preloadedImages.has(imageUrl)) {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, imageUrl]));
        };
        img.onerror = () => {
          console.error('❌ Failed to preload image:', imageUrl);
        };
        img.src = imageUrl;
      }
    });
  }, [currentBackground, nextBackground, preloadedImages]);

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
            ${isTransitioning ? "opacity-0" : "opacity-100"}
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
            ${isTransitioning ? "opacity-100" : "opacity-0"}
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

