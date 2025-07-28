import { ShowcaseData } from "../../types/showcase";
import { GridImagesShowcase } from "./GridImagesShowcase";
import { SingleImageShowcase } from "./SingleImageShowcase";
import { VideoShowcase } from "./VideoShowcase";

interface ShowcaseRendererProps {
  showcase: ShowcaseData;
  project?: unknown;
}

export const ShowcaseRenderer = ({ showcase }: ShowcaseRendererProps) => {
  switch (showcase.type) {
    case "image-single":
      return <SingleImageShowcase data={showcase} />;

    case "image-grid":
      return <GridImagesShowcase data={showcase} />;

    case "video":
      return <VideoShowcase data={showcase} />;


    default:
      console.warn(
        `Unknown showcase type: ${(showcase as { type: string }).type}`,
      );
      return null;
  }
};
