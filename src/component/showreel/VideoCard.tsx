import { cn } from "../../utils/cn";
import showreelLight from "../../assets/images/showreel_light.webp";
import cardBackground from "../../assets/images/card_backgrounds/1.webp";
import { ReactPlayerWrapper } from "../common/ReactPlayerWrapper";

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
  return (
    <div
      className={cn(
        "group glint-card-wrapper glint-card-wrapper-always cursor-default w-full card-item",
        className,
      )}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
    >
      <div
        className="glint-card-content p-6"
        style={{
          background: `url(${cardBackground}) center/cover`,
        }}
      >
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl z-10">
          <ReactPlayerWrapper
            src={src}
            light={showreelLight}
            className="w-full h-full rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
