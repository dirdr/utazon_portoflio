import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { useMemo, useRef } from "react";

const getCardBackgrounds = () => {
  const backgrounds = [];
  for (let i = 1; i <= 3; i++) {
    backgrounds.push(
      new URL(`../../assets/images/card_backgrounds/${i}.png`, import.meta.url)
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
    name: string;
    header: string;
    date: string;
  };
  className?: string;
  onClick?: () => void;
  glintSpeed?: string;
}

export const Card = ({
  image,
  thumbnail,
  project,
  className,
  onClick,
  glintSpeed = "6s",
}: CardProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const randomBackground = useMemo(() => {
    const hash = project.name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % cardBackgrounds.length;
    return cardBackgrounds[index];
  }, [project.name]);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
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
      onClick={onClick}
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
          {/* SVG clipPath definition */}
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
                />{" "}
              </clipPath>
            </defs>
          </svg>

          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            style={{ clipPath: "url(#rounded-diagonal-cut)" }}
          />

          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ clipPath: "url(#rounded-diagonal-cut)" }}
            muted
            loop
            playsInline
          >
            <source src={thumbnail.src} type="video/webm" />
          </video>

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

          <div className="absolute bottom-4 right-4 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Button glint className="text-xs" as="button">
              {t("common.seeProject")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
