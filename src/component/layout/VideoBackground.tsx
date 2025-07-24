import { useVideo } from "../../hooks/useVideo";
import { RadialGradient } from "../common/RadialGradient";

export const VideoBackground = () => {
  const { videoRef, introSrc, shouldPlayVideo, shouldShowLayout } = useVideo();

  if (!shouldPlayVideo) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        autoPlay
        playsInline
        disablePictureInPicture
        src={introSrc}
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
