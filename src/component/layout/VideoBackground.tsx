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

  const handleVideoReady = () => {
    console.log('🎬 Video ready, starting sequence');
    setTimeout(() => {
      console.log('🎬 Video sequence complete, showing layout');
      setShouldShowLayout(true);
    }, ANIMATION_CONFIG.FADE_IN_DELAY);
  };

  return (
    <div className="fixed inset-0" style={{ zIndex: -20 }}>
      <video
        className="w-full h-full object-cover"
        muted
        autoPlay
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
        src="/videos/intro.webm"
        onCanPlayThrough={handleVideoReady}
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
