import { cn } from "../../utils/cn";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import showreelThumbnail from "../../assets/images/showreel_background.webp";
import showreelLight from "../../assets/images/showreel_light.webp";
import cardBackground from "../../assets/images/card_backgrounds/1.webp";
import { useVideo } from "../../hooks/useVideo";

interface VideoCardProps {
  src: string;
  className?: string;
  glintSpeed?: string;
}

export const VideoCard = ({
  src,
  className,
  glintSpeed = "6s",
}: VideoCardProps) => {
  const [userActive, setUserActive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const timeoutRef = useRef<number>();
  const { volume, isMuted } = useVideo();

  const resetInactivityTimer = () => {
    setUserActive(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setUserActive(false);
    }, 3000);
  };

  const handleUserActivity = () => {
    resetInactivityTimer();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "group glint-card-wrapper glint-card-wrapper-always cursor-default w-full card-item",
        className,
      )}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
      onMouseMove={handleUserActivity}
      onMouseEnter={handleUserActivity}
      onClick={handleUserActivity}
    >
      <div
        className="glint-card-content p-6"
        style={{
          background: `url(${cardBackground}) center/cover`,
        }}
      >
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl z-10">
          <ReactPlayer
            ref={playerRef}
            src={src}
            width="100%"
            height="100%"
            controls={userActive && isPlaying}
            playing={isPlaying}
            muted={isMuted}
            loop
            volume={volume}
            style={{ borderRadius: "0.75rem" }}
            light={showreelLight}
            onReady={() => {
              setIsReady(true);
              console.log("Video ready");
            }}
            onClickPreview={() => {
              setIsPlaying(true);
              resetInactivityTimer();
            }}
            onPlay={() => {
              setIsPlaying(true);
              resetInactivityTimer();
            }}
            onPause={() => {
              setIsPlaying(false);
              resetInactivityTimer();
            }}
            onError={(error) => {
              console.error("Video error:", error);
            }}
          />
        </div>
      </div>
    </div>
  );
};
