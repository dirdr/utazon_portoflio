import { useVideo } from "../../contexts/video";

export const VideoBackground = () => {
  const { videoRef, introSrc, shouldPlayVideo } = useVideo();

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
        src={introSrc}
      />
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
};
