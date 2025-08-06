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
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      <VideoCard
        src={videoUrl}
        className="w-full 
                   max-w-[95vw] max-h-[70vh]
                   sm:max-w-[90vw] sm:max-h-[65vh] 
                   md:max-w-4xl md:max-h-[60vh] 
                   lg:max-w-5xl lg:max-h-[65vh] 
                   xl:max-w-6xl xl:max-h-[70vh] 
                   2xl:max-w-7xl 2xl:max-h-[75vh]"
        light={showreelLight}
      />
    </div>
  );
};
