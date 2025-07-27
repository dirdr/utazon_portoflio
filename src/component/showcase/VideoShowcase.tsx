import { VideoShowcaseData } from "../../types/showcase";
import { Container } from "../layout/Container";
import { ReactPlayerWrapper } from "../common/ReactPlayerWrapper";

interface VideoShowcaseProps {
  data: VideoShowcaseData;
}

export const VideoShowcase = ({ data }: VideoShowcaseProps) => {
  const { video } = data;

  return (
    <Container>
      <div className="w-full h-screen rounded-2xl border-2 border-muted my-4 overflow-hidden">
        <ReactPlayerWrapper
          src={video.src}
          light={video.light}
          className="w-full h-full"
        />
      </div>
    </Container>
  );
};
