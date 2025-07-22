import { cn } from "../../utils/cn";
import { useState } from "react";
import ReactPlayer from "react-player";

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
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const backgroundImage = new URL(
    `../../assets/images/card_backgrounds/1.webp`,
    import.meta.url,
  ).href;

  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => setShowControls(false);

  return (
    <div
      className={cn(
        "group glint-card-wrapper glint-card-wrapper-always cursor-default w-full card-item",
        className,
      )}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="glint-card-content p-6"
        style={{
          background: `url(${backgroundImage}) center/cover`,
        }}
      >
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
          <ReactPlayer
            src={src}
            width="100%"
            height="100%"
            controls={showControls}
            playing={isPlaying}
            muted={false}
            loop
            volume={0.8}
            style={{ borderRadius: "0.75rem" }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      </div>
    </div>
  );
};
