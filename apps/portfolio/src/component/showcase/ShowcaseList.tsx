import { useMemo } from "react";
import { ShowcaseData } from "../../types/showcase";
import { Project } from "../../types/project";
import { ShowcaseRenderer } from "./ShowcaseRenderer";
import { ShowcaseSkeletonList } from "./ShowcaseSkeleton";
import { useShowcaseMediaReady } from "../../hooks/useShowcaseMediaReady";

interface ShowcaseListProps {
  showcases: ShowcaseData[];
  project?: Project;
}

export const ShowcaseList = ({ showcases, project }: ShowcaseListProps) => {
  const sortedShowcases = useMemo(
    () => [...showcases].sort((a, b) => a.order - b.order),
    [showcases],
  );

  const ready = useShowcaseMediaReady(sortedShowcases);

  // Placeholders carry the real layout, so revealing does not shift anything.
  if (!ready) {
    return <ShowcaseSkeletonList showcases={sortedShowcases} />;
  }

  return (
    <div className="space-y-4 lg:space-y-8 showcase-reveal">
      {sortedShowcases.map((showcase) => (
        <ShowcaseRenderer
          key={showcase.id}
          showcase={showcase}
          project={project}
        />
      ))}
    </div>
  );
};
