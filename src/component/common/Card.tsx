import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { LineSweepText } from "./LineSweepText";
import { useTransitionContext } from "../../hooks/useTransitionContext";
import { useAnimationControl } from "../../hooks/useAnimationControl";
import { useProjectGridPreloader } from "../../hooks/useProjectGridPreloader";
import { isMobile } from "../../utils/mobileDetection";

import p1 from "../../assets/images/card_backgrounds/1.webp";
import p2 from "../../assets/images/card_backgrounds/2.webp";
import p3 from "../../assets/images/card_backgrounds/3.webp";

const cardBackgrounds = [p1, p2, p3];

export interface CardProps {
  image: {
    src: string;
    alt: string;
  };
  thumbnail?: {
    src: string;
    alt: string;
  };
  project: {
    id: string;
    name: string;
    header: string;
    date: string;
  };
  className?: string;
  glintSpeed?: string;
  priority?: boolean;
}

export const Card = ({
  image,
  thumbnail,
  project,
  className,
  glintSpeed = "6s",
}: CardProps) => {
  const { t } = useTranslation();
  const { navigateWithTransition } = useTransitionContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { ref: animationRef, shouldAnimate } = useAnimationControl({
    threshold: 0.2,
    rootMargin: "100px",
  });

  const preloader = useProjectGridPreloader({
    projectId: project.id,
    hasVideo: !!thumbnail,
    rootMargin: "200px",
    threshold: 0.1,
  });

  const randomBackground = useMemo(() => {
    const hash = project.name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % cardBackgrounds.length;
    return cardBackgrounds[index];
  }, [project.name]);

  const elementRef = useRef<HTMLElement | null>(null);

  const combinedRef = useCallback(
    (node: HTMLElement | null) => {
      if (elementRef.current) {
        preloader.observeElement(null);
      }
      elementRef.current = node;
      animationRef(node);
      if (node) {
        preloader.observeElement(node);
      }
    },
    [animationRef, preloader],
  );

  const startVideoAnimation = () => {
    if (thumbnail && videoReady && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const stopVideoAnimation = () => {
    if (thumbnail && videoReady && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMouseEnter = () => {
    if (isMobile()) return;
    setIsHovered(true);
    startVideoAnimation();
  };

  const handleMouseLeave = () => {
    if (isMobile()) return;
    setIsHovered(false);
    stopVideoAnimation();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsTouched(true);
    setIsHovered(true);
    startVideoAnimation();

    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  const handleTouchEnd = () => {
    setIsTouched(false);
    setIsHovered(false);
    stopVideoAnimation();

    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  const handleClick = async () => {
    await navigateWithTransition(`/projects/${project.id}`, { id: project.id });
  };

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigateWithTransition(`/projects/${project.id}`, { id: project.id });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    const timeoutRef = animationTimeoutRef.current;
    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, []);

  // Conditional event props based on device type
  const isMobileDevice = isMobile();
  const eventProps = isMobileDevice
    ? {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
      }
    : {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      };

  return (
    <article
      ref={combinedRef}
      className={cn(
        "group glint-card-wrapper cursor-pointer w-full card-item",
        { "touch-active": isTouched }, // Add touch-active class for mobile glint
        className,
      )}
      data-animate={shouldAnimate}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
      {...eventProps}
      onClick={handleClick}
    >
      <div
        className="glint-card-content p-3 sm:p-4 md:p-5 lg:p-6 xl:p-5 2xl:p-6"
        style={{
          background: `url(${randomBackground}) center/cover`,
        }}
      >
        <figure className="relative aspect-[16/9] w-full rounded-xl overflow-hidden group">
          <svg className="absolute w-0 h-0">
            <defs>
              <clipPath
                id={`rounded-diagonal-cut-${project.id}`}
                clipPathUnits="objectBoundingBox"
              >
                <path
                  d="
          M0,0
          L0.69,0
          Q0.72,0 0.73,0.015
          L0.985,0.27
          Q1,0.285 1,0.31
          L1,1
          L0,1
          Z
        "
                />
              </clipPath>
            </defs>
          </svg>

          <img
            src={image.src}
            alt={image.alt}
            className={cn(
              "h-full w-full object-cover transition-all duration-300",
              thumbnail &&
                videoReady &&
                (isHovered || isTouched) &&
                "opacity-0",
            )}
            style={{ clipPath: `url(#rounded-diagonal-cut-${project.id})` }}
            loading="eager"
          />

          {thumbnail && !videoError && (
            <video
              ref={videoRef}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-300",
                videoReady
                  ? cn("opacity-0", (isHovered || isTouched) && "opacity-100")
                  : "hidden",
              )}
              style={{ clipPath: `url(#rounded-diagonal-cut-${project.id})` }}
              src={thumbnail.src}
              muted
              loop
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              preload={shouldAnimate ? "metadata" : "none"}
              onLoadedData={() => {
                setVideoReady(true);
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setVideoReady(true);
                }
              }}
              onCanPlay={() => {
                if (videoRef.current) {
                  setVideoReady(true);
                }
              }}
              onError={() => {
                setVideoReady(false);
                setVideoError(true);
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <figcaption className="absolute bottom-0 left-0 p-6">
            <div className="flex items-center gap-4">
              <div className="w-px bg-border self-stretch min-h-[40px]" />
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-nord text-xl font-bold italic mb-1 transition-colors duration-300",
                    isHovered ? "text-muted" : "text-white",
                  )}
                >
                  <LineSweepText
                    animate={isHovered || isTouched}
                    className="text-sm 2xl:text-base"
                  >
                    {project.name}
                  </LineSweepText>
                </h3>
                <p className="font-nord text-white font-light text-xs 2xl:text-sm">
                  {project.header}
                </p>
              </div>
            </div>
          </figcaption>

          <div className="absolute top-[5%] left-[90%]">
            <time className="text-muted font-nord font-light text-[11px] sm:text-sm md:text-lg xl:text-sm 2xl:text-lg">
              {project.date}
            </time>
          </div>

          <div className="absolute bottom-8 right-8 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out will-change-transform">
            <Button
              glint
              proximityIntensity
              maxDistance={200}
              as="button"
              onClick={handleButtonClick}
              speed={3}
            >
              {t("common.seeProject")}
            </Button>
          </div>
        </figure>
      </div>
    </article>
  );
};
