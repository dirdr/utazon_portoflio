import { VideoCard } from "../Showreel/VideoCard";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { useEffect } from "react";

const SHOWREEL_BG = "/src/assets/images/background.webp";

export const Showreel = () => {
  const setBackgroundImage = useBackgroundStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    setBackgroundImage(SHOWREEL_BG);
    return () => setBackgroundImage(null);
  }, [setBackgroundImage]);

  return (
    <div className="h-full flex items-center justify-center px-6">
      <VideoCard
        src="/videos/showreel.webm"
        className="w-full max-w-screen-2xl"
      />
    </div>
  );
};
