import { VideoShowcaseData } from "../../types/showcase";
import { Container } from "../layout/Container";
import { ReactPlayerWrapper } from "../common/ReactPlayerWrapper";

interface VideoShowcaseProps {
  data: VideoShowcaseData;
}

interface VideoShowcaseProps {
  data: VideoShowcaseData;
  className?: string;
}

export const VideoShowcase = ({ data, className = "" }: VideoShowcaseProps) => {
  const { video } = data;

  return (
    <Container>
      <div
        className={`w-full aspect-video rounded-2xl border-2 border-muted my-4 overflow-hidden px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 ${className}`}
      >
        <ReactPlayerWrapper
          src={video.src}
          width="100%"
          height="100%"
          controls
          light={video.light}
          style={{ aspectRatio: "16/9" }}
        />
      </div>
    </Container>
  );
};
