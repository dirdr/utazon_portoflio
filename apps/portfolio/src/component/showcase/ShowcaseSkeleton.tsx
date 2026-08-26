import { ShowcaseData } from "../../types/showcase";
import { Skeleton } from "../common/Skeleton";
import { Container } from "../layout/Container";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";

const tile = cn(
  "w-full h-full",
  SHOWCASE_STYLES.borderRadius,
  SHOWCASE_STYLES.border,
);

/** Placeholder matching the footprint of one showcase, so nothing shifts. */
const ShowcaseShape = ({ showcase }: { showcase: ShowcaseData }) => {
  switch (showcase.type) {
    case "video": {
      const ratio = showcase.aspectRatio;
      const isVertical = ratio === "9/16";
      return (
        <div className={cn("w-full", isVertical && "max-w-2xl mx-auto")}>
          {/* Inline: a templated aspect-[] class is not statically extractable. */}
          <div style={{ aspectRatio: ratio ?? "16 / 9" }}>
            <Skeleton className={tile} />
          </div>
        </div>
      );
    }

    case "video-carousel":
      return (
        <div className="aspect-video">
          <Skeleton className={tile} />
        </div>
      );

    case "video-grid": {
      const columns = showcase.columns ?? 2;
      return (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {showcase.videos.map((_, index) => (
            <div key={index} className="aspect-video">
              <Skeleton className={tile} />
            </div>
          ))}
        </div>
      );
    }

    case "mixed-grid-2x2":
      return (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-video">
              <Skeleton className={tile} />
            </div>
          ))}
        </div>
      );

    case "image-grid":
      return (
        <div className="grid grid-cols-2 gap-4">
          {showcase.images.map((_, index) => (
            <div key={index} className="aspect-video">
              <Skeleton className={tile} />
            </div>
          ))}
        </div>
      );

    case "image-single":
      return (
        <div className="aspect-video">
          <Skeleton className={tile} />
        </div>
      );

    default:
      return null;
  }
};

interface ShowcaseSkeletonListProps {
  showcases: ShowcaseData[];
}

export const ShowcaseSkeletonList = ({
  showcases,
}: ShowcaseSkeletonListProps) => (
  <div className="space-y-4 lg:space-y-8" aria-busy="true">
    {showcases.map((showcase) => (
      <Container
        key={showcase.id}
        variant="constrained"
        className="xl:px-24 2xl:px-32"
      >
        <ShowcaseShape showcase={showcase} />
      </Container>
    ))}
  </div>
);
