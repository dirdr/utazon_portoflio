import { VideoGridShowcaseData } from "../../types/showcase";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { CopyrightOverlay } from "../common/CopyrightOverlay";
import { cn } from "../../utils/cn";
import ReactPlayer from "react-player";
import { usePresignedVideoUrl } from "../../hooks/usePresignedVideoUrl";

interface VideoGridShowcaseProps {
  data: VideoGridShowcaseData;
  className?: string;
  border?: boolean;
}

interface GridVideoItemProps {
  src: string;
  title?: string;
  border: boolean;
  showCopyright?: boolean;
  copyrightKey?: string;
  aspectRatio?: string;
}

const GridVideoItem = ({
  src,
  title,
  border,
  showCopyright,
  copyrightKey,
  aspectRatio,
}: GridVideoItemProps) => {
  const { url: videoUrl, loading } = usePresignedVideoUrl(src);

  return (
    <figure className="w-full">
      <div
        className={cn(
          "w-full overflow-hidden relative",
          !aspectRatio && "aspect-video",
          border && SHOWCASE_STYLES.borderRadius,
          border && SHOWCASE_STYLES.border,
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {videoUrl && (
          <ReactPlayer
            src={videoUrl}
            playing={true}
            muted={true}
            loop={true}
            controls={false}
            playsInline={true}
            width="100%"
            height="100%"
            className="react-player"
            style={{
              objectFit: "cover" as const,
            }}
          />
        )}

        {/* COPYRIGHT OVERLAY */}
        {showCopyright && copyrightKey && (
          <CopyrightOverlay translationKey={copyrightKey} />
        )}
      </div>
      {title && <figcaption className="sr-only">{title}</figcaption>}
    </figure>
  );
};

const GRID_COLUMNS = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

const SPAN_CLASSES: Record<number, string> = {
  1: "",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "col-span-full",
};

export const VideoGridShowcase = ({
  data,
  className,
  border = false,
}: VideoGridShowcaseProps) => {
  const { videos, columns = 2, aspectRatio } = data;

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid gap-4 lg:gap-8", GRID_COLUMNS[columns])}>
        {videos.map((video, index) => (
          <div
            key={index}
            className={cn(
              videos.length === 1 && "col-span-full",
              video.span && SPAN_CLASSES[video.span],
            )}
          >
            <GridVideoItem
              src={video.src}
              title={video.title}
              border={border}
              showCopyright={!!data.copyright}
              copyrightKey={data.copyright?.key}
              aspectRatio={video.aspectRatio ?? aspectRatio}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
