import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoCarouselShowcaseData } from "../../types/showcase";
import { CarouselVideoCard } from "./CarouselVideoCard";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";

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
  const { t } = useTranslation();
  const params = useParams();
  const projectId = params.id;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isProgressRunning, setIsProgressRunning] = useState(false);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsVideoEnded(false);
    setIsProgressRunning(false);
    setAnimationKey((prev) => prev + 1);
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
    setAnimationKey((prev) => prev + 1); // Reset animation when video starts playing
  };

  useEffect(() => {
    if (isVideoEnded) {
      const timer = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % data.videos.length;
        setCurrentIndex(nextIndex);
        setIsVideoEnded(false);
        setIsProgressRunning(false);
        setAnimationKey((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVideoEnded, currentIndex, data.videos.length]);

  useEffect(() => {
    setIsProgressRunning(false);
    setAnimationKey((prev) => prev + 1);
  }, [currentIndex]);

  return (
    <div className={cn("w-full  mx-auto ", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4 items-center">
        <div className="flex items-start">
          <div className="w-px bg-gray-600 mr-6 lg:mr-8 flex-shrink-0 self-stretch"></div>
          <div className="space-y-6 max-w-xl">
            {projectId &&
              t(`projects.${projectId}.carouselDescription`, {
                returnObjects: true,
              }) &&
              (
                t(`projects.${projectId}.carouselDescription`, {
                  returnObjects: true,
                }) as string[]
              ).map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-300 text-base md:text-lg xl:text-sm 2xl:text-base leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
          </div>
        </div>

        {/* Right Column - Video Content */}
        <div className="space-y-4">
          <div
            className={cn(
              "w-full aspect-video overflow-hidden",
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
                className="h-full"
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

          {/* Navigation Dots - Under Video */}
          <div className="flex justify-center items-center gap-1.5">
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
                      className="w-12 h-2.5 bg-gray-600 rounded-full relative overflow-hidden smooth-animation"
                      initial={{ width: 10, height: 10, borderRadius: "50%" }}
                      animate={{
                        width: 48,
                        height: 10,
                        borderRadius: "9999px",
                      }}
                      exit={{ width: 10, height: 10, borderRadius: "50%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ contentVisibility: "auto" }}
                    >
                      <div
                        key={animationKey}
                        className="h-full bg-white rounded-full animate-progress-bar"
                        style={{
                          animationDuration: `${videoDuration || 10}s`,
                          animationPlayState: isProgressRunning
                            ? "running"
                            : "paused",
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`collapsed-${index}`}
                      className="w-2.5 h-2.5 bg-white rounded-full hover:bg-white/80"
                      initial={{
                        width: 48,
                        height: 10,
                        borderRadius: "9999px",
                      }}
                      animate={{ width: 10, height: 10, borderRadius: "50%" }}
                      exit={{ width: 48, height: 10, borderRadius: "9999px" }}
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
