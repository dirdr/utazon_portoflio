import { useVideo } from "../common/VideoContext";

const VideoBackground = () => {
  const { videoRef, handleVideoEnded, introSrc, isMuted } = useVideo();

  return (
    <div className="fixed inset-0 -z-10">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnded}
        muted
        autoPlay
        playsInline
        src={introSrc}
      ></video>
    </div>
  );
};

export default VideoBackground;
