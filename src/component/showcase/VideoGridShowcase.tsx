import { VideoGridShowcaseData } from "../../types/showcase";
import { apiClient } from "../../services/api";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";

interface VideoGridShowcaseProps {
  data: VideoGridShowcaseData;
  className?: string;
  border?: boolean;
}

export const VideoGridShowcase = ({
  data,
  className,
  border = false,
}: VideoGridShowcaseProps) => {
  const { videos } = data;

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video, index) => {
          return (
            <div key={index} className="w-full">
              <div
                className={cn(
                  "w-full aspect-video overflow-hidden",
                  border && SHOWCASE_STYLES.borderRadius,
                  border && SHOWCASE_STYLES.border,
                )}
              >
                <video
                  src={video.src}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

