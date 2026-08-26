import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { useMemo, useRef, useState, useCallback, useEffect, memo } from "react";
import { LineSweepText } from "./LineSweepText";
import { Skeleton } from "./Skeleton";
import { useTransitionContext } from "../../hooks/useTransitionContext";
import { useProjectGridPreloader } from "../../hooks/useProjectGridPreloader";
import { useActiveVideoCard } from "../../hooks/useActiveVideoCard";
import { useCardActivation } from "../../hooks/useCardActivation";
import { useImageLoaded } from "../../hooks/useImageLoaded";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { usePrefetchOnHover } from "../../hooks/usePrefetchOnHover";

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
  /** Seeds playback before any scroll happens. */
  isFirst?: boolean;
}

const CardComponent = ({
  image,
  thumbnail,
  project,
  className,
  glintSpeed = "6s",
  priority = false,
  isFirst = false,
}: CardProps) => {
  const { t } = useTranslation();
  const { navigateWithTransition } = useTransitionContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  /**
   * Hover-preview is only meaningful where a pointer can rest on a card.
   * Everywhere else the viewport centre decides, so a scroll gesture never
   * starts or stops playback.
   */
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  const cover = useImageLoaded(image.src);
  const [isPlaying, setIsPlaying] = useState(false);

  const preloader = useProjectGridPreloader({
    projectId: project.id,
    hasVideo: !!thumbnail,
    rootMargin: "200px",
    threshold: 0.1,
  });

  const { setActiveCard, isActiveCard } = useActiveVideoCard(project.id);

  useCardActivation({
    cardId: project.id,
    enabled: !canHover && !!thumbnail,
    isFirst,
    elementRef,
  });

  const { onMouseEnter: onPrefetchEnter, onMouseLeave: onPrefetchLeave } =
    usePrefetchOnHover(project.id, { enabled: canHover });

  const randomBackground = useMemo(() => {
    const hash = project.name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % cardBackgrounds.length;
    return cardBackgrounds[index];
  }, [project.name]);

  const combinedRef = useCallback(
    (node: HTMLElement | null) => {
      if (elementRef.current) {
        preloader.observeElement(null);
      }
      elementRef.current = node;
      if (node) {
        preloader.observeElement(node);
      }
    },
    [preloader],
  );

  /**
   * Single owner of playback. The video carries preload="none", so nothing is
   * fetched until this card is elected, and only one video streams at a time.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !thumbnail) return;

    if (!isActiveCard) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    // readyState >= HAVE_FUTURE_DATA means we can start without waiting.
    if (video.readyState >= 3) {
      start();
      return;
    }

    video.preload = "auto";
    video.load();
    video.addEventListener("canplay", start, { once: true });
    return () => {
      cancelled = true;
      video.removeEventListener("canplay", start);
    };
  }, [isActiveCard, thumbnail]);

  const handleMouseEnter = useCallback(() => {
    if (!canHover) return;
    onPrefetchEnter();
    setActiveCard(project.id);
  }, [canHover, onPrefetchEnter, setActiveCard, project.id]);

  const handleMouseLeave = useCallback(() => {
    if (!canHover) return;
    onPrefetchLeave();
    setActiveCard(null);
  }, [canHover, onPrefetchLeave, setActiveCard]);

  const handleClick = useCallback(async () => {
    await navigateWithTransition(`/projects/${project.id}`, { id: project.id });
  }, [navigateWithTransition, project.id]);

  const handleButtonClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      await navigateWithTransition(`/projects/${project.id}`, {
        id: project.id,
      });
    },
    [navigateWithTransition, project.id],
  );

  const cardStyle = useMemo(
    (): React.CSSProperties =>
      ({
        "--glint-card-speed": glintSpeed,
      }) as React.CSSProperties,
    [glintSpeed],
  );

  const clipPath = `url(#rounded-diagonal-cut-${project.id})`;

  return (
    <article
      ref={combinedRef}
      className={cn(
        "group glint-card-wrapper cursor-pointer w-full card-item",
        className,
      )}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div
        className="glint-card-content p-3 sm:p-4 md:p-5 lg:p-6 xl:p-5 2xl:p-6"
        style={{
          backgroundColor: "oklch(18% 0 0)",
          backgroundImage: `url(${randomBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <figure
          className="relative aspect-[16/9] w-full rounded-xl overflow-hidden group"
          aria-busy={!cover.loaded}
        >
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

          {!cover.loaded && (
            <Skeleton className="absolute inset-0" style={{ clipPath }} />
          )}

          <img
            src={image.src}
            alt={image.alt}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-300",
              cover.loaded ? "opacity-100" : "opacity-0",
              isPlaying && "opacity-0",
            )}
            style={{ clipPath }}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            onLoad={cover.onLoad}
            onError={cover.onError}
          />

          {thumbnail && (
            <video
              ref={videoRef}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                isPlaying ? "opacity-100" : "opacity-0",
              )}
              style={{ clipPath }}
              src={thumbnail.src}
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
              aria-hidden="true"
              onPlaying={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setIsPlaying(false)}
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
                    isActiveCard ? "text-muted" : "text-white",
                  )}
                >
                  <LineSweepText
                    animate={isActiveCard}
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

          {canHover && (
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
          )}
        </figure>
      </div>
    </article>
  );
};

export const Card = memo(CardComponent, (prevProps, nextProps) => {
  return (
    prevProps.image.src === nextProps.image.src &&
    prevProps.project.id === nextProps.project.id &&
    prevProps.project.name === nextProps.project.name &&
    prevProps.project.header === nextProps.project.header &&
    prevProps.project.date === nextProps.project.date &&
    prevProps.className === nextProps.className &&
    prevProps.glintSpeed === nextProps.glintSpeed &&
    prevProps.priority === nextProps.priority &&
    prevProps.isFirst === nextProps.isFirst &&
    prevProps.thumbnail?.src === nextProps.thumbnail?.src
  );
});
