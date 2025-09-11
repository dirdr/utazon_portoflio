import { VideoGridShowcaseData } from "../../types/showcase";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import { getVideoUrl } from "../../utils/videoUrl";

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
  const { t } = useTranslation();
  const { videos } = data;

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        {videos.map((video, index) => {
          return (
            <figure key={index} className="w-full">
              <div
                className={cn(
                  "w-full aspect-video overflow-hidden",
                  border && SHOWCASE_STYLES.borderRadius,
                  border && SHOWCASE_STYLES.border,
                )}
              >
                <ReactPlayer
                  src={getVideoUrl(video.src)}
                  playing={true}
                  muted={true}
                  loop={true}
                  controls={false}
                  playsInline={true}
                  width="100%"
                  height="100%"
                  className="react-player"
                  style={{
                    objectFit: 'cover' as const,
                  }}
                />
              </div>
              {video.title && (
                <figcaption className="sr-only">{video.title}</figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {data.copyright && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 text-muted">
            {t(data.copyright.key)}
          </p>
        </div>
      )}
    </div>
  );
};
