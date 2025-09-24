import { useRoute } from "wouter";
import { getProjectById } from "../../data/projects";
import { Container } from "../layout/Container";
import { ProjectHeroSection } from "./project-details/ProjectHeroSection";
import { useRef, useEffect } from "react";
import { ShowcaseList } from "../showcase/ShowcaseList";

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
    <article className="min-h-screen flex flex-col">
      <div className="flex-1 pb-16 lg:pb-24">
        <header className="lg:mb-16">
          <ProjectHeroSection project={displayProject} />
        </header>
        {displayProject.showcases && displayProject.showcases.length > 0 && (
          <main>
            <ShowcaseList
              showcases={displayProject.showcases}
              project={displayProject}
            />
          </main>
        )}
      </div>
    </article>
  );
};
