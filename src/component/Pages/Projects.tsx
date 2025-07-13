import { useLocation } from "wouter";
import { Card } from "../common/Card";
import { allProjects } from "../../data/projects";

export const Projects = () => {
  const [, setLocation] = useLocation();

  const handleProjectClick = (projectId: string) => {
    setLocation(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="w-full px-4 sm:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {allProjects.map((project) => (
            <Card
              key={project.id}
              image={{
                src: project.cover,
                alt: project.title,
              }}
              project={{
                name: project.title,
                description: project.description,
              }}
              onClick={() => handleProjectClick(project.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
