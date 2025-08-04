import { VideoCard } from "../showreel/VideoCard";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { useEffect } from "react";
import showreelBackground from "../../assets/images/background.webp";
import showreelLight from "../../assets/images/showreel_light.webp";
import { apiClient } from "../../services/api";

export const Showreel = () => {
  const setBackgroundImage = useBackgroundStore(
    (state) => state.setBackgroundImage,
  );
  
  const videoUrl = apiClient.getVideoUrl("showreel.mp4");

  useEffect(() => {
    setBackgroundImage(showreelBackground, "Showreel");
    return () => setBackgroundImage(null, "Showreel");
  }, [setBackgroundImage]);

  return (
    <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <VideoCard
        src={videoUrl}
        className="w-full h-full max-w-7xl max-h-[80vh]"
        light={showreelLight}
      />
    </div>
  );
};
