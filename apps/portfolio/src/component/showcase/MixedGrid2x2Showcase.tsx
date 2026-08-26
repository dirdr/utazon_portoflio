import { MixedGrid2x2ShowcaseData } from "../../types/showcase";
import { ShowcaseImage } from "../common/ShowcaseImage";
import { CopyrightOverlay } from "../common/CopyrightOverlay";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";
import { usePresignedVideoUrl } from "../../hooks/usePresignedVideoUrl";
import { useVideoAutoplay } from "../../hooks/useVideoAutoplay";

interface MixedGrid2x2ShowcaseProps {
  data: MixedGrid2x2ShowcaseData;
  className?: string;
  border?: boolean;
}

export const MixedGrid2x2Showcase = ({
  data,
  className,
  border = false,
}: MixedGrid2x2ShowcaseProps) => {
  const { video, images } = data;

  const { url: videoUrl, loading: urlLoading } = usePresignedVideoUrl(
    video.src,
  );

  // Centralized autoplay hook with mobile compatibility
  const { videoRef, hasError, videoProps } = useVideoAutoplay({
    enabled: true,
    retryDelay: 500,
    maxRetries: 3,
  });

  return (
    <div className={cn("w-full mx-auto", className)}>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2",
          "gap-4 md:gap-6 lg:gap-8",
        )}
      >
        <div
          className={cn(
            "w-full h-full overflow-hidden flex items-center justify-center bg-black relative",
            border && SHOWCASE_STYLES.borderRadius,
            border && SHOWCASE_STYLES.border,
          )}
        >
          {urlLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div
                className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full"
                style={{ animation: "spin 1s linear infinite" }}
              />
            </div>
          )}

          {!hasError && videoUrl && (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={videoUrl}
              {...videoProps}
            />
          )}

          {/* COPYRIGHT OVERLAY */}
          {!hasError && videoUrl && data.copyright && (
            <CopyrightOverlay translationKey={data.copyright.key} />
          )}

          {hasError && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-sm">Video unavailable</p>
            </div>
          )}
        </div>

        {images[0] && (
          <figure className="w-full">
            <ShowcaseImage
              src={images[0].src}
              alt={images[0].alt}
              className={cn(
                "w-full h-auto object-cover bg-black",
                border && SHOWCASE_STYLES.borderRadius,
                border && SHOWCASE_STYLES.border,
              )}
            />
            {images[0].caption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center">
                {images[0].caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Bottom Left - Image 2 */}
        {images[1] && (
          <figure className="w-full">
            <ShowcaseImage
              src={images[1].src}
              alt={images[1].alt}
              className={cn(
                "w-full h-auto object-cover bg-black",
                border && SHOWCASE_STYLES.borderRadius,
                border && SHOWCASE_STYLES.border,
              )}
            />
            {images[1].caption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center">
                {images[1].caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Bottom Right - Image 3 */}
        {images[2] && (
          <figure className="w-full">
            <ShowcaseImage
              src={images[2].src}
              alt={images[2].alt}
              className={cn(
                "w-full h-auto object-cover bg-black",
                border && SHOWCASE_STYLES.borderRadius,
                border && SHOWCASE_STYLES.border,
              )}
            />
            {images[2].caption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center">
                {images[2].caption}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </div>
  );
};
