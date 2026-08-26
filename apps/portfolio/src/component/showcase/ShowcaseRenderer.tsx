import { ShowcaseData } from "../../types/showcase";
import { Project } from "../../types/project";
import { GridImagesShowcase } from "./GridImagesShowcase";
import { SingleImageShowcase } from "./SingleImageShowcase";
import { VideoShowcase } from "./VideoShowcase";
import { VideoCarouselShowcase } from "./VideoCarouselShowcase";
import { VideoGridShowcase } from "./VideoGridShowcase";
import { MixedGrid2x2Showcase } from "./MixedGrid2x2Showcase";
import { Container } from "../layout/Container";

interface ShowcaseRendererProps {
  showcase: ShowcaseData;
  project?: Project;
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

      case "mixed-grid-2x2":
        return <MixedGrid2x2Showcase data={showcase} border={true} />;

      default:
        return null;
    }
  };

  return (
    <Container variant="constrained" className="xl:px-24 2xl:px-32">
      {renderShowcase()}
    </Container>
  );
};
