import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoCarouselShowcaseData } from "../../types/showcase";
import { CarouselVideoCard } from "./CarouselVideoCard";
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
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isProgressRunning, setIsProgressRunning] = useState(false);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsVideoEnded(false);
    setIsProgressRunning(false);
    setAnimationKey(prev => prev + 1); // Reset animation
  };

  const handleDurationChange = (duration: number) => {
    setVideoDuration(duration);
  };

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    setIsProgressRunning(false);
  };

  const handleVideoPlay = () => {
    setIsProgressRunning(true);
    setAnimationKey(prev => prev + 1); // Reset animation when video starts playing
  };

  // Auto-advance to next video when current one ends
  useEffect(() => {
    if (isVideoEnded) {
      const timer = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % data.videos.length;
        setCurrentIndex(nextIndex);
        setIsVideoEnded(false);
        setIsProgressRunning(false);
        setAnimationKey(prev => prev + 1); // Reset animation
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVideoEnded, currentIndex, data.videos.length]);

  // Reset progress state when video changes
  useEffect(() => {
    setIsProgressRunning(false);
    setAnimationKey(prev => prev + 1);
  }, [currentIndex]);

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
            <CarouselVideoCard
              src={data.videos[currentIndex].src}
              title={data.videos[currentIndex].title}
              onDurationChange={handleDurationChange}
              onEnded={handleVideoEnd}
              onPlay={handleVideoPlay}
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
                  className="w-16 h-3 bg-gray-600 rounded-full relative overflow-hidden smooth-animation"
                  initial={{ width: 12, height: 12, borderRadius: "50%" }}
                  animate={{ width: 64, height: 12, borderRadius: "9999px" }}
                  exit={{ width: 12, height: 12, borderRadius: "50%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ contentVisibility: 'auto' }}
                >
                  <div
                    key={animationKey}
                    className="h-full bg-white rounded-full animate-progress-bar"
                    style={{
                      animationDuration: `${videoDuration || 10}s`,
                      animationPlayState: isProgressRunning ? 'running' : 'paused'
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key={`collapsed-${index}`}
                  className="w-3 h-3 bg-white rounded-full hover:bg-white/80" 
                  initial={{ width: 64, height: 12, borderRadius: "9999px" }}
                  animate={{ width: 12, height: 12, borderRadius: "50%" }}
                  exit={{ width: 64, height: 12, borderRadius: "9999px" }}
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

