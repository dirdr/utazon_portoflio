import { useTranslation } from "react-i18next";
import { Project } from "../../types/project";
import { Container } from "../layout/Container";

interface GradientConfig {
  top?: { size: string; enabled: boolean };
  bottom?: { size: string; enabled: boolean };
  right?: { start: string; enabled: boolean };
}

interface ProjectHeroSectionProps {
  project: Project;
  imageWidth?: "65%" | "66.666667%" | string;
  gradients?: GradientConfig;
}

const defaultGradients: GradientConfig = {
  top: { size: "35vh", enabled: true },
  bottom: { size: "25vh", enabled: true },
  right: { start: "48%", enabled: true },
};

export const ProjectHeroSection = ({
  project,
  gradients = defaultGradients,
}: ProjectHeroSectionProps) => {
  const { t } = useTranslation();
  const config = { ...defaultGradients, ...gradients };

  return (
    <section className="relative w-full bg-black">
      <div className="lg:hidden">
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src={`/images/projects/${project.id}/background.webp`}
            alt={t(project.title)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none">
            {config.top?.enabled && (
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent" />
            )}
            {config.bottom?.enabled && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
            )}
          </div>
        </div>

        {/* Mobile content */}
        <div className="px-4 py-12">
          <Container>
            <h1 className="font-nord text-3xl md:text-4xl font-bold mb-2 text-white">
              {t(project.title)}
            </h1>
            <h2 className="font-nord text-lg md:text-xl mb-6 font-thin text-white">
              {t(project.header)}
            </h2>
            <p className="font-neue text-base md:text-lg leading-relaxed text-gray mb-12">
              {t(project.description)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-base">
              <div>
                <h3 className="font-nord text-white uppercase">Date</h3>
                <p className="font-neue text-gray">{t(project.date)}</p>
              </div>
              <div>
                <h3 className="font-nord text-white uppercase">Client</h3>
                <p className="font-neue text-gray">{t(project.client)}</p>
              </div>
              <div>
                <h3 className="font-nord text-white uppercase">Role</h3>
                <p className="font-neue text-gray">{t(project.role)}</p>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <div className="hidden lg:block h-[80vh]">
        <div className="absolute top-0 left-0 w-[65%] h-full overflow-hidden">
          <img
            src={`/images/projects/${project.id}/background.webp`}
            alt={t(project.title)}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {config.top?.enabled && (
            <div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent"
              style={{ height: config.top.size }}
            />
          )}

          {config.bottom?.enabled && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent"
              style={{ height: config.bottom.size }}
            />
          )}

          {config.right?.enabled && (
            <div
              className="absolute top-0 h-full bg-gradient-to-r from-transparent via-black/90 to-black"
              style={{
                left: config.right.start ?? "48%",
                width: `calc(65% - ${config.right.start ?? "48%"})`,
              }}
            />
          )}
        </div>

        <div className="absolute top-0 right-0 w-[35%] h-full flex items-center">
          <Container>
            <div className="pl-8">
              <h1 className="font-nord text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 text-white">
                {t(project.title)}
              </h1>
              <h2 className="font-nord text-xl xl:text-2xl mb-8 font-thin text-white">
                {t(project.header)}
              </h2>
              <p className="font-neue text-lg xl:text-xl leading-relaxed text-gray mb-16">
                {t(project.description)}
              </p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 text-lg">
                  <div>
                    <h3 className="font-nord text-white uppercase">Date</h3>
                    <p className="font-neue text-gray">{t(project.date)}</p>
                  </div>
                  <div>
                    <h3 className="font-nord text-white uppercase">Client</h3>
                    <p className="font-neue text-gray">{t(project.client)}</p>
                  </div>
                  <div>
                    <h3 className="font-nord text-white uppercase">Role</h3>
                    <p className="font-neue text-gray">{t(project.role)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};
