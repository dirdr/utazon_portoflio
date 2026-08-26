import { cn } from "../../utils/cn";
import { useAnimationControl } from "../../hooks/useAnimationControl";
import { useVideoAutoplay } from "../../hooks/useVideoAutoplay";

export interface ProjectVideoCardProps {
  video: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
  className?: string;
  glintSpeed?: string;
}

export const ProjectVideoCard = ({
  video,
  title,
  description,
  className,
  glintSpeed = "3s",
}: ProjectVideoCardProps) => {
  const { ref: animationRef, shouldAnimate } = useAnimationControl({
    threshold: 0.2,
    rootMargin: "100px",
  });

  // Centralized autoplay hook with mobile compatibility
  const { videoRef, hasError, videoProps } = useVideoAutoplay({
    enabled: true,
    retryDelay: 500,
    maxRetries: 3,
  });

  return (
    <div
      ref={animationRef}
      className={cn("group glint-card-wrapper-square w-full", className)}
      data-animate={shouldAnimate}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
    >
      <div className="glint-card-content-square">
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden video-container flex flex-col bg-black">
          <div className="relative flex-[55] w-full">
            {!hasError && (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={video.src}
                {...videoProps}
              />
            )}

            {hasError && (
              <div className="h-full w-full bg-black flex items-center justify-center">
                <p className="text-white">Video unavailable</p>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>

          <div className="flex-[45] bg-black flex flex-col justify-center items-start px-14">
            <h3 className="font-nord text-white text-sm sm:text-base md:text-lg xl:text-base 2xl:text-xl font-bold italic mb-1 sm:mb-2 md:mb-3 xl:mb-2 2xl:mb-4">
              {title}
            </h3>
            <p className="paragraph text-white">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
