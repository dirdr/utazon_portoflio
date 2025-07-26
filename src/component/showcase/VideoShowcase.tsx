import { VideoShowcaseData } from "../../types/showcase";
import { Container } from "../layout/Container";

interface VideoShowcaseProps {
  data: VideoShowcaseData;
}

export const VideoShowcase = ({ data }: VideoShowcaseProps) => {
  const { video } = data;

  return (
    <section className="w-full">
      <Container>
        <div className="w-full">
          <video
            src={video.src}
            autoPlay={video.autoPlay ?? true}
            loop={video.loop ?? true}
            muted={video.muted ?? true}
            playsInline
            poster={video.poster}
            className="w-full h-screen object-cover rounded-lg"
            aria-label={video.title || "Project video"}
          />
          {video.title && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {video.title}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
};