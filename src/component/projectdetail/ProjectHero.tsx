import { useTranslation } from "react-i18next";
import { Project } from "../../types/project";
import { Container } from "../layout/Container";

interface ProjectHeroProps {
  project: Project;
}

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/images/projects/${project.id}/hero.webp)`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold mb-4 text-white">
            {t(project.title)}
          </h1>

          <h2 className="text-lg font-light mb-8 text-white/90">
            {t(project.header)}
          </h2>

          <p className="text-lg eading-relaxed mb-12 text-white/80">
            {t(project.description)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div>
              <h3 className="text-lg font-bold mb-2 text-white/60 uppercase tracking-wider">
                Date
              </h3>
              <p className="text-lg">{t(project.date)}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-white/60 uppercase tracking-wider">
                Client
              </h3>
              <p className="text-lg">{t(project.client)}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-white/60 uppercase tracking-wider">
                Role
              </h3>
              <p>{t(project.role)}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
