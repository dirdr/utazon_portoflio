import { useState } from "react";
import { VideoCarouselShowcaseData } from "../../types/showcase";
import { VideoCard } from "./VideoCard";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";

interface VideoCarouselShowcaseProps {
  data: VideoCarouselShowcaseData;
  className?: string;
  border?: boolean;
}

export const VideoCarouselShowcase = ({
  data,
  className,
  border = false,
}: VideoCarouselShowcaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setAnimationKey(prev => prev + 1); // Reset animation
  };

  const handleDurationChange = (duration: number) => {
    setVideoDuration(duration);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full aspect-video overflow-hidden mb-4",
          border && SHOWCASE_STYLES.borderRadius,
          border && SHOWCASE_STYLES.border,
        )}
      >
        <VideoCard
          src={data.videos[currentIndex].src}
          title={data.videos[currentIndex].title}
          onDurationChange={handleDurationChange}
          isActive={true}
        />
      </div>
      
      <div className="flex justify-center items-center gap-2">
        {data.videos.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className="relative focus:outline-none"
          >
            {index === currentIndex ? (
              <div className="w-12 h-2 bg-gray-600 rounded-full relative overflow-hidden">
                <div
                  key={animationKey}
                  className="h-full bg-white rounded-full animate-progress-bar"
                  style={{ 
                    animationDuration: videoDuration ? `${videoDuration}s` : '10s',
                    animationTimingFunction: 'linear',
                    animationFillMode: 'forwards'
                  }}
                />
              </div>
            ) : (
              <div className="w-2 h-2 bg-white rounded-full hover:bg-white/80 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};