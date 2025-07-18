import { cn } from "../../utils/cn";
import { CardProps } from "../../types/card";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

export const Card = ({
  image,
  project,
  className,
  onClick,
  glintSpeed = "4s",
}: CardProps) => {
  const { t } = useTranslation();

  const ENABLE_EFFECTS = true;
  const ENABLE_GLINT = true;
  const ENABLE_ANIMATED_BACKGROUND = true;

  return (
    <div
      className={cn(
        "group relative cursor-pointer",
        ENABLE_EFFECTS ? "glint-card-wrapper" : "glint-card-wrapper-disabled",
        "w-full",
        className,
      )}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
      onClick={onClick}
    >
      <div className="glint-card-content border border-white/20 p-8 relative z-10">
        {ENABLE_ANIMATED_BACKGROUND && (
          <div className="animated-background"></div>
        )}

        <div className="relative w-full rounded-xl overflow-hidden z-10">
          <div className="relative w-full h-full">
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full"
              style={{
                clipPath: "polygon(0 0, 75% 0, 100% 25%, 100% 100%, 0 100%)",
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 p-6">
            <div className="flex items-start gap-4">
              <div className="w-px bg-white self-stretch min-h-[40px]"></div>
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

          <div className="absolute top-6 right-8">
            <div className="text-muted font-nord text-lg font-light">
              {project.date}
            </div>
          </div>

          <div className="absolute bottom-4 right-4 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Button glint={ENABLE_GLINT} className="text-xs" as="button">
              {t("common.seeProject")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
