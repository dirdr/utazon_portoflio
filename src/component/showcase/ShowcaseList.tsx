import { ShowcaseData } from "../../types/showcase";
import { ShowcaseRenderer } from "./ShowcaseRenderer";

interface ShowcaseListProps {
  showcases: ShowcaseData[];
  project?: unknown;
}

export const ShowcaseList = ({ showcases, project }: ShowcaseListProps) => {
  const sortedShowcases = [...showcases].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-0">
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