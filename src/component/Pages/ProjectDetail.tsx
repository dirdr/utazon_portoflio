import { useRoute } from "wouter";
import { getProjectById } from "../../data/projects";

export const ProjectDetail = () => {
  const [, params] = useRoute("/projects/:id");
  const project = params?.id ? getProjectById(params.id) : null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="font-nord text-2xl">Project not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-16">
        <div className="max-w-4xl mx-auto">
          <img
            src={project.cover}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-2xl mb-8"
          />
          
          <h1 className="font-nord text-4xl md:text-6xl font-bold mb-6">
            {project.title}
          </h1>
          
          <p className="font-neue text-lg text-muted leading-relaxed mb-8">
            {project.longDescription}
          </p>
        </div>
      </div>
    </div>
  );
};