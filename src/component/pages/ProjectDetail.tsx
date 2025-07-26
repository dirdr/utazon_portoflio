import { useRoute } from "wouter";
import { getProjectById } from "../../data/projects";
import { Container } from "../layout/Container";
import { ProjectHeroSection } from "../projectdetail/ProjectHeroSection";
import { useRef, useEffect } from "react";
import { ShowcaseList } from "../showcase/ShowcaseList";
import { getShowcaseConfigForProject } from "../../data/showcaseConfigs";

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

  const showcaseConfig = getShowcaseConfigForProject(displayProject.id);

  return (
    <div>
      {/* Hero section - always present and consistent across all projects */}
      <ProjectHeroSection project={displayProject} />
      
      {/* Configurable showcase sections - different layouts per project */}
      {showcaseConfig && (
        <ShowcaseList 
          showcases={showcaseConfig.showcases} 
          project={displayProject}
        />
      )}
      
      <section className="min-h-screen bg-black text-white">
        <Container>
          <div className="py-24">
            <h2 className="font-nord text-3xl font-bold mb-8">
              Project Details
            </h2>
            <p className="font-neue text-lg">
              Additional project content goes here. This section scrolls
              normally and the background image stays in place above.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};
