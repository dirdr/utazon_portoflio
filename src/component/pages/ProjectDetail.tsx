import { useRoute } from "wouter";
import { getProjectById } from "../../data/projects";
import { Container } from "../layout/Container";
import { ProjectHeroSection } from "../projectdetail/ProjectHeroSection";
import { useRef, useEffect } from "react";
import { ShowcaseList } from "../showcase/ShowcaseList";
import { ScrollablePageWrapper } from "../common/ScrollablePageWrapper";

export const ProjectDetail = () => {
  const [, params] = useRoute("/projects/:id");
  const project = params?.id ? getProjectById(params.id) : null;
  const previousProjectRef = useRef(project);

  useEffect(() => {
    if (project) {
      previousProjectRef.current = project;
    }
  }, [project]);

  const displayProject = project || previousProjectRef.current;

  if (!displayProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Container>
          <h1 className="font-nord text-2xl text-center">Project not found</h1>
        </Container>
      </div>
    );
  }

  return (
    <ScrollablePageWrapper>
      <div className="mb-4 lg:mb-16">
        <div className="mb-4 md:mb-16">
          <ProjectHeroSection project={displayProject} />
        </div>
        {displayProject.showcases && displayProject.showcases.length > 0 && (
          <ShowcaseList
            showcases={displayProject.showcases}
            project={displayProject}
          />
        )}
      </div>
    </ScrollablePageWrapper>
  );
};
