import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setVideoProgress(0);
    setIsVideoEnded(false);
  };

  const handleDurationChange = (duration: number) => {
    setVideoDuration(duration);
  };

  const handleVideoProgress = (progress: number) => {
    setVideoProgress(progress);
  };

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    setVideoProgress(0);
  };

  // Auto-advance to next video when current one ends
  useEffect(() => {
    if (isVideoEnded) {
      const timer = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % data.videos.length;
        setCurrentIndex(nextIndex);
        setVideoProgress(0);
        setIsVideoEnded(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVideoEnded, currentIndex, data.videos.length]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full aspect-video overflow-hidden mb-4",
          border && SHOWCASE_STYLES.borderRadius,
          border && SHOWCASE_STYLES.border,
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <VideoCard
              src={data.videos[currentIndex].src}
              title={data.videos[currentIndex].title}
              onDurationChange={handleDurationChange}
              onProgress={handleVideoProgress}
              onEnded={handleVideoEnd}
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-2">
        {data.videos.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            className="relative focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <AnimatePresence mode="wait">
              {index === currentIndex ? (
                <motion.div
                  key={`expanded-${index}`}
                  className="w-12 h-2 bg-gray-600 rounded-full relative overflow-hidden"
                  initial={{ width: 8, height: 8, borderRadius: "50%" }}
                  animate={{ width: 48, height: 8, borderRadius: "9999px" }}
                  exit={{ width: 8, height: 8, borderRadius: "50%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${videoProgress * 100}%` }}
                    transition={{ 
                      duration: 0.1, 
                      ease: "linear" 
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key={`collapsed-${index}`}
                  className="w-2 h-2 bg-white rounded-full hover:bg-white/80" 
                  initial={{ width: 48, height: 8, borderRadius: "9999px" }}
                  animate={{ width: 8, height: 8, borderRadius: "50%" }}
                  exit={{ width: 48, height: 8, borderRadius: "9999px" }}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

