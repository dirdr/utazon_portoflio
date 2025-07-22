import { useRoute } from "wouter";
import { getProjectById } from "../../data/projects";
import { Container } from "../layout/Container";
import { ProjectHeroSection } from "../ProjectDetail/ProjectHeroSection";

export const ProjectDetail = () => {
  const [, params] = useRoute("/projects/:id");
  const project = params?.id ? getProjectById(params.id) : null;

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
      <ProjectHeroSection project={project} />
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
