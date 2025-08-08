import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { useMemo, useRef, useState } from "react";
import { LineSweepText } from "./LineSweepText";
import { useLocation } from "wouter";

const getCardBackgrounds = () => {
  const backgrounds = [];
  for (let i = 1; i <= 3; i++) {
    backgrounds.push(
      new URL(`../../assets/images/card_backgrounds/${i}.webp`, import.meta.url)
        .href,
    );
  }
  return backgrounds;
};

const cardBackgrounds = getCardBackgrounds();

export interface CardProps {
  image: {
    src: string;
    alt: string;
  };
  thumbnail: {
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
  priority = false,
}: CardProps) => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const randomBackground = useMemo(() => {
    const hash = project.name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % cardBackgrounds.length;
    return cardBackgrounds[index];
  }, [project.name]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoReady && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoReady && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    setLocation(`/projects/${project.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/projects/${project.id}`);
  };

  return (
    <div
      className={cn(
        "group glint-card-wrapper cursor-pointer w-full card-item",
        className,
      )}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div
        className="glint-card-content p-2 sm:p-3 md:p-6"
        style={{
          background: `url(${randomBackground}) center/cover`,
        }}
      >
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden group">
          <svg className="absolute w-0 h-0">
            <defs>
              <clipPath
                id={`rounded-diagonal-cut-${project.id}`}
                clipPathUnits="objectBoundingBox"
              >
                <path
                  d="
          M0,0
          L0.73,0
          Q0.75,0 0.76,0.01
          L0.99,0.24
          Q1,0.25 1,0.27
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
              videoReady && "group-hover:opacity-0",
            )}
            style={{ clipPath: `url(#rounded-diagonal-cut-${project.id})` }}
            loading={priority ? "eager" : "lazy"}
          />

          {!videoError && (
            <video
              ref={videoRef}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-300",
                videoReady ? "opacity-0 group-hover:opacity-100" : "hidden",
              )}
              style={{ clipPath: `url(#rounded-diagonal-cut-${project.id})` }}
              src={thumbnail.src}
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => {
                setVideoReady(true);
              }}
              onError={() => {
                setVideoReady(false);
                setVideoError(true);
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 p-6">
            <div className="flex items-start gap-4">
              <div className="w-px bg-white self-stretch min-h-[40px]" />
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-nord text-xl font-bold italic mb-1 transition-colors duration-300",
                    isHovered ? "text-muted" : "text-white",
                  )}
                >
                  <LineSweepText
                    animate={isHovered}
                    className="text-base md:text-lg lg:text-xl"
                  >
                    {project.name}
                  </LineSweepText>
                </h3>
                <p className="font-nord text-white font-light">
                  {project.header}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8">
            <div className="text-muted font-nord font-light text-xs sm:text-sm md:text-base">
              {project.date}
            </div>
          </div>

          <div className="absolute bottom-8 right-8 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Button
              glint
              proximityIntensity
              maxDistance={200}
              className="text-base"
              as="button"
              onClick={handleButtonClick}
            >
              {t("common.seeProject")}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
