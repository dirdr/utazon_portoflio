import { ShowcaseData } from "../../types/showcase";
import { ImageShowcase } from "./ImageShowcase";
import { VideoShowcase } from "./VideoShowcase";

interface ShowcaseRendererProps {
  showcase: ShowcaseData;
  project?: unknown;
}

export const ShowcaseRenderer = ({ showcase }: ShowcaseRendererProps) => {
  switch (showcase.type) {
    case "image":
      return <ImageShowcase data={showcase} />;

    case "video":
      return <VideoShowcase data={showcase} />;

    case "behind-the-scenes":
      console.warn("Behind-the-scenes showcase not yet implemented");
      return null;

    case "carousel":
      console.warn("Carousel showcase not yet implemented");
      return null;

    default:
      console.warn(
        `Unknown showcase type: ${(showcase as { type: string }).type}`,
      );
      return null;
  }
};

