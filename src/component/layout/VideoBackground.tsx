import { useRouteBasedVideo } from "../../hooks/useRouteBasedVideo";
import { useVideo } from "../../hooks/useVideo";
import { RadialGradient } from "../common/RadialGradient";
import { ANIMATION_CONFIG } from "../../constants/animations";

export const VideoBackground = () => {
  const { shouldPlayVideo } = useRouteBasedVideo();
  const { shouldShowLayout, setShouldShowLayout } = useVideo();

  if (!shouldPlayVideo) {
    return null;
  }

  const handleVideoLoaded = () => {
    setTimeout(() => {
      setShouldShowLayout(true);
    }, ANIMATION_CONFIG.FADE_IN_DELAY);
  };

  return (
    <div className="fixed inset-0 -z-10">
      <video
        className="w-full h-full object-cover"
        muted
        autoPlay
        loop
        playsInline
        disablePictureInPicture
        src="/videos/intro.webm"
        onLoadedData={handleVideoLoaded}
      />
      {shouldShowLayout && (
        <RadialGradient
          size={1}
          opacity={0.95}
          className="absolute inset-0"
          edgeColor="rgba(0, 0, 0, 1)"
          centerColor="transparent"
        />
      )}
    </div>
  );
};
