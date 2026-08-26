import { VideoGridShowcaseData } from "../../types/showcase";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { CopyrightOverlay } from "../common/CopyrightOverlay";
import { cn } from "../../utils/cn";
import ReactPlayer from "react-player";
import { usePresignedVideoUrl } from "../../hooks/usePresignedVideoUrl";
import { useVideoReady } from "../../hooks/useVideoReady";
import { Skeleton } from "../common/Skeleton";
import { useShowcaseRevealed } from "../../contexts/showcaseReveal";

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
  controls?: boolean;
}

const GridVideoItem = ({
  src,
  title,
  border,
  showCopyright,
  copyrightKey,
  aspectRatio,
  controls = false,
}: GridVideoItemProps) => {
  const { url: videoUrl, loading } = usePresignedVideoUrl(src);
  const media = useVideoReady();
  const revealed = useShowcaseRevealed();

  const isFill = aspectRatio === "fill";
  const isAuto = aspectRatio === "auto";

  return (
    <figure className={cn("w-full", isFill && "h-full")}>
      <div
        className={cn(
          "w-full overflow-hidden relative",
          isFill ? "h-full" : !aspectRatio && !isAuto && "aspect-video",
          border && SHOWCASE_STYLES.borderRadius,
          border && SHOWCASE_STYLES.border,
        )}
        style={!isFill && !isAuto && aspectRatio ? { aspectRatio } : undefined}
      >
        {(loading || !media.ready || !revealed) && (
          <Skeleton className="absolute inset-0 z-[5]" />
        )}
        {videoUrl && isAuto ? (
          <video
            src={videoUrl}
            autoPlay={!controls}
            muted={!controls}
            loop={!controls}
            controls={controls}
            playsInline
            onCanPlay={media.onCanPlay}
            onError={media.onError}
            className="w-full h-auto block"
          />
        ) : videoUrl ? (
          <ReactPlayer
            src={videoUrl}
            playing={!controls}
            muted={!controls}
            loop={!controls}
            controls={controls}
            playsInline={true}
            width="100%"
            height="100%"
            className="react-player"
            onReady={media.onCanPlay}
            onError={media.onError}
            style={{
              objectFit: "cover" as const,
            }}
          />
        ) : null}

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
  const { videos, columns = 2, gridTemplate, matchHeight, aspectRatio } = data;

  const computedTemplate =
    gridTemplate ??
    (matchHeight
      ? videos
          .map((v) => {
            if (!v.aspectRatio) return "1fr";
            const [w, h] = v.aspectRatio.split("/").map(Number);
            return `${w / h}fr`;
          })
          .join(" ")
      : undefined);

  return (
    <div className={cn("w-full", className)}>
      {computedTemplate && data.id && (
        <style>{`
          @media (min-width: 768px) {
            #${data.id} { grid-template-columns: ${computedTemplate}; }
          }
        `}</style>
      )}
      <div
        id={computedTemplate ? data.id : undefined}
        className={cn(
          "grid gap-4 lg:gap-8",
          computedTemplate ? "grid-cols-1" : GRID_COLUMNS[columns],
        )}
      >
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
              controls={video.controls}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
