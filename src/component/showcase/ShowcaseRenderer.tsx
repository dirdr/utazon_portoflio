import { ShowcaseData } from "../../types/showcase";
import { GridImagesShowcase } from "./GridImagesShowcase";
import { SingleImageShowcase } from "./SingleImageShowcase";
import { VideoShowcase } from "./VideoShowcase";

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

      default:
        console.warn(
          `Unknown showcase type: ${(showcase as { type: string }).type}`,
        );
        return null;
    }
  };

  return (
    <div className="mx-4 lg:mx-32 my-4">
      {renderShowcase()}
    </div>
  );
};
