import { cn } from "../../utils/cn";
import cardBackground from "../../assets/images/card_backgrounds/1.webp";
import { ReactPlayerWrapper } from "../common/ReactPlayerWrapper";

interface VideoCardProps {
  src: string;
  className?: string;
  glintSpeed?: string;
  light: string;
}

export const VideoCard = ({
  src,
  className,
  glintSpeed = "6s",
  light,
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
        className="glint-card-content p-2 sm:p-3 md:p-4 lg:p-6 flex items-center justify-center"
        style={{
          background: `url(${cardBackground}) center/cover`,
        }}
      >
        <div className="w-full aspect-video">
          <ReactPlayerWrapper
            src={src}
            light={light}
            width="100%"
            height="100%"
            controls
            className="rounded-md sm:rounded-lg overflow-hidden"
            pip={false}
          />
        </div>
      </div>
    </div>
  );
};
