import { ShowcaseData } from "../../types/showcase";
import { GridImagesShowcase } from "./GridImagesShowcase";
import { SingleImageShowcase } from "./SingleImageShowcase";
import { VideoShowcase } from "./VideoShowcase";
import { VideoCarouselShowcase } from "./VideoCarouselShowcase";
import { VideoGridShowcase } from "./VideoGridShowcase";

interface ShowcaseRendererProps {
  showcase: ShowcaseData;
  project?: unknown;
}

export const ShowcaseRenderer = ({ showcase }: ShowcaseRendererProps) => {
  const renderShowcase = () => {
    switch (showcase.type) {
      case "image-single":
        return <SingleImageShowcase data={showcase} border={true} />;

      case "image-grid":
        return <GridImagesShowcase data={showcase} border={true} />;

      case "video":
        return <VideoShowcase data={showcase} border={true} />;

      case "video-carousel":
        return <VideoCarouselShowcase data={showcase} border={true} />;

      case "video-grid":
        return <VideoGridShowcase data={showcase} border={true} />;

      default:
        return null;
    }
  };

  return (
    <div className="mx-4 lg:mx-32">
      {renderShowcase()}
    </div>
  );
};
