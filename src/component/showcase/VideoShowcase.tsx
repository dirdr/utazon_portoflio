import { VideoShowcaseData } from "../../types/showcase";
import { Container } from "../layout/Container";
import { ReactPlayerWrapper } from "../common/ReactPlayerWrapper";
import { apiClient } from "../../services/api";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";

interface VideoShowcaseProps {
  data: VideoShowcaseData;
  className?: string;
}

export const VideoShowcase = ({ data, className }: VideoShowcaseProps) => {
  const { video } = data;
  const videoUrl = apiClient.getVideoUrl(video.src);

  return (
    <Container>
      <div className={cn(SHOWCASE_STYLES.container, className)}>
        <div className={cn(
          "w-full aspect-video overflow-hidden",
          SHOWCASE_STYLES.borderRadius,
          SHOWCASE_STYLES.border
        )}>
          <ReactPlayerWrapper
            src={videoUrl}
            width="100%"
            height="100%"
            controls
          />
        </div>
      </div>
    </Container>
  );
};
