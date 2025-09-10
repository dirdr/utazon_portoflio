import { VideoShowcaseData } from "../../types/showcase";
import { InteractiveVideoPlayer } from "../common/InteractiveVideoPlayer";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";
import { getVideoUrl } from "../../utils/videoUrl";

interface VideoShowcaseProps {
  data: VideoShowcaseData;
  className?: string;
  border?: boolean;
}

export const VideoShowcase = ({
  data,
  className,
  border = false,
}: VideoShowcaseProps) => {
  const { video } = data;
  const videoUrl = getVideoUrl(video.src);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full aspect-video overflow-hidden",
          border && SHOWCASE_STYLES.borderRadius,
          border && SHOWCASE_STYLES.border,
        )}
      >
        <InteractiveVideoPlayer
          src={videoUrl}
          width="100%"
          height="100%"
          controls={true}
          startTime={video.startTime}
        />
      </div>
    </div>
  );
};
