import { VideoShowcaseData } from "../../types/showcase";
import { Container } from "../layout/Container";
import { ReactPlayerWrapper } from "../common/ReactPlayerWrapper";
import { apiClient } from "../../services/api";

interface VideoShowcaseProps {
  data: VideoShowcaseData;
  className?: string;
}

export const VideoShowcase = ({ data, className = "" }: VideoShowcaseProps) => {
  const { video } = data;
  const videoUrl = apiClient.getVideoUrl(video.src);

  return (
    <Container>
      <div className={`w-full my-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 ${className}`}>
        <div className="w-full aspect-video rounded-2xl border-1 lg:border-2 border-muted overflow-hidden">
          <ReactPlayerWrapper
            src={videoUrl}
            width="100%"
            height="100%"
            controls
            light={video.light}
          />
        </div>
      </div>
    </Container>
  );
};
