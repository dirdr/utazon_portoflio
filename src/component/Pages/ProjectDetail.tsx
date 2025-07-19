import { useRoute } from "wouter";
import { getProjectById } from "../../data/projects";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { ProjectHero } from "../ProjectDetail/ProjectHero";

export const ProjectDetail = () => {
  const [, params] = useRoute("/projects/:id");
  const project = params?.id ? getProjectById(params.id) : null;
  const { t } = useTranslation();

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Container>
          <h1 className="font-nord text-2xl text-center">Project not found</h1>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <ProjectHero project={project} />
    </div>
  );
};
