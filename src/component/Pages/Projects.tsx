import { useLocation } from "wouter";
import { Card } from "../common/Card";
import { allProjectsSortedByPriority } from "../../data/projects";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";

export const Projects = () => {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const handleProjectClick = (projectId: string) => {
    setLocation(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {allProjectsSortedByPriority.map((project) => (
            <Card
              key={project.id}
              image={{
                src: project.cover,
                alt: t(project.title),
              }}
              project={{
                name: t(project.title),
                header: t(project.header),
                date: t(project.date),
              }}
              onClick={() => handleProjectClick(project.id)}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};
