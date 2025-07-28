import { VideoCard } from "../showreel/VideoCard";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { useEffect } from "react";
import showreelBackground from "../../assets/images/showreel_background.webp";

export const Showreel = () => {
  const setBackgroundImage = useBackgroundStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    setBackgroundImage(showreelBackground, "Showreel");
    return () => setBackgroundImage(null, "Showreel");
  }, [setBackgroundImage]);

  return (
    <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <VideoCard
        src="https://utazon-backend.adrienpelfresne.com/api/videos/showreel.mp4"
        className="w-full h-full max-w-7xl max-h-[80vh]"
      />
    </div>
  );
};
