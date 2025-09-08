import { VideoGridShowcaseData } from "../../types/showcase";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";

interface VideoGridShowcaseProps {
  data: VideoGridShowcaseData;
  className?: string;
  border?: boolean;
}

export const VideoGridShowcase = ({
  data,
  className,
  border = false,
}: VideoGridShowcaseProps) => {
  const { t } = useTranslation();
  const { videos } = data;

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        {videos.map((video, index) => {
          return (
            <div key={index} className="w-full">
              <div
                className={cn(
                  "w-full aspect-video overflow-hidden",
                  border && SHOWCASE_STYLES.borderRadius,
                  border && SHOWCASE_STYLES.border,
                )}
              >
                <video
                  src={video.src}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Copyright Text */}
      {data.copyright && (
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 text-muted">
            {t(data.copyright.key)}
          </p>
        </div>
      )}
    </div>
  );
};

