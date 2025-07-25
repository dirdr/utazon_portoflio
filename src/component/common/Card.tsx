import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { useMemo, useRef, useState } from "react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const randomBackground = useMemo(() => {
    const hash = project.name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % cardBackgrounds.length;
    return cardBackgrounds[index];
  }, [project.name]);


  const handleMouseEnter = () => {
    if (videoReady && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoReady && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
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
    >
      <div
        className="glint-card-content p-6"
        style={{
          background: `url(${randomBackground}) center/cover`,
        }}
      >
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden group">
          <svg className="absolute w-0 h-0">
            <defs>
              <clipPath
                id="rounded-diagonal-cut"
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
              "h-full w-full object-cover transition-opacity duration-300",
              videoReady && "group-hover:opacity-0",
            )}
            style={{ clipPath: "url(#rounded-diagonal-cut)" }}
            loading={priority ? "eager" : "lazy"}
          />

          {!videoError && (
            <video
              ref={videoRef}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                videoReady ? "opacity-0 group-hover:opacity-100" : "hidden",
              )}
              style={{ clipPath: "url(#rounded-diagonal-cut)" }}
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
                <h3 className="font-nord text-xl font-bold italic text-white mb-1">
                  {project.name}
                </h3>
                <p className="font-nord text-white font-light">
                  {project.header}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-8 right-8">
            <div className="text-muted font-nord font-light">
              {project.date}
            </div>
          </div>

          <div className="absolute bottom-8 right-8 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Button
              glint
              proximityIntensity
              maxDistance={200}
              className="text-base"
              as="link"
              href={`/projects/${project.id}`}
            >
              {t("common.seeProject")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
