import { useRoute } from "wouter";
import { getProjectById } from "../../data/projects";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";

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
    <div className="min-h-screen pt-32 pb-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <img
            src={project.cover}
            alt={t(project.title)}
            className="w-full aspect-video object-cover rounded-2xl mb-8"
          />

          <h1 className="font-nord text-4xl md:text-6xl font-bold mb-6">
            {t(project.title)}
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="font-nord text-xl font-bold mb-2 text-muted">
                {t(project.header)}
              </h2>
              <p className="font-neue text-lg leading-relaxed">
                {t(project.description)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-nord font-bold mb-2 text-muted">Client</h3>
                <p className="font-neue">{t(project.client)}</p>
              </div>
              <div>
                <h3 className="font-nord font-bold mb-2 text-muted">Role</h3>
                <p className="font-neue">{t(project.role)}</p>
              </div>
              <div>
                <h3 className="font-nord font-bold mb-2 text-muted">Date</h3>
                <p className="font-neue">{t(project.date)}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

