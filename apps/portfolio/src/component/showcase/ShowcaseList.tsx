import { useMemo } from "react";
import { ShowcaseData } from "../../types/showcase";
import { Project } from "../../types/project";
import { ShowcaseRenderer } from "./ShowcaseRenderer";
import { ShowcaseRevealContext } from "../../contexts/showcaseReveal";
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

  // The real showcases are always mounted, so every container holds its final
  // size from the first paint. Only the placeholders inside them swap out, and
  // they all swap together, which makes a layout shift impossible.
  return (
    <ShowcaseRevealContext.Provider value={ready}>
      <div className="space-y-4 lg:space-y-8">
        {sortedShowcases.map((showcase, index) => (
          <ShowcaseRenderer
            key={showcase.id}
            showcase={showcase}
            project={project}
            priority={index === 0}
          />
        ))}
      </div>
    </ShowcaseRevealContext.Provider>
  );
};
