import { cn } from "../../utils/cn";
import { CardProps } from "../../types/card";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import cardBackground from "../../assets/images/card_background.webp";

export const Card = ({
  image,
  project,
  className,
  onClick,
  glintSpeed = "4s",
}: CardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "group glint-card-wrapper cursor-pointer w-full card-item",
        className,
      )}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
      onClick={onClick}
    >
      <div
        className="glint-card-content p-6"
        style={{
          background: `url(${cardBackground}) center/cover`,
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
            className="h-full w-full object-cover"
            style={{ clipPath: "url(#rounded-diagonal-cut)" }}
          />

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
