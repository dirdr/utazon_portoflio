import React from "react";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";

export const ImageBackgroundDisplay: React.FC = () => {
  const { backgroundImage, isTransitioning } = useBackgroundStore();

  if (!backgroundImage) {
    console.log("No background image, returning null");
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <div
        className={`
          absolute inset-0 
          transition-opacity duration-300 ease-in-out
          ${isTransitioning ? "opacity-0" : "opacity-100"}
        `}
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      </div>
    </div>
  );
};

