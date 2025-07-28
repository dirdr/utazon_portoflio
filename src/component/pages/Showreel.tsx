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
    <div className="h-full flex items-center justify-center p-4 sm:p-6">
      <VideoCard
        src="/videos/showreel.webm"
        className="w-full max-w-[min(90vw,90vh*16/9)] sm:max-w-[min(85vw,85vh*16/9)] lg:max-w-[min(80vw,80vh*16/9)]"
      />
    </div>
  );
};
