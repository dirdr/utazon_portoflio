import { useTranslation } from "react-i18next";
import { Project } from "../../types/project";
import { Container } from "../layout/Container";

interface ProjectHeroSectionProps {
  project: Project;
}

export const ProjectHeroSection = ({ project }: ProjectHeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-left bg-no-repeat"
          style={{
            backgroundImage: `url(/images/projects/${project.id}/background.webp)`,
            aspectRatio: "16 / 9",
            width: "min(100vw, calc(80vh * 16 / 9))",
            height: "80vh",
            left: "0",
          }}
        />
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, transparent 50%, rgba(0,0,0,0.1) 54%, rgba(0,0,0,0.3) 57%, rgba(0,0,0,0.6) 59%, rgba(0,0,0,0.9) 61%, black 63%)",
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent"
            style={{ height: "25vh" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent"
            style={{ height: "25vh" }}
          />
        </div>
      </div>
      <div className="relative z-10 h-full flex items-center">
        <Container>
          <div className="flex justify-end">
            <div className="w-[36rem]">
              <h1 className="font-nord text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                {t(project.title)}
              </h1>

              <div className="space-y-8">
                <div>
                  <h2 className="font-nord text-xl md:text-2xl font-bold mb-4 text-white/90">
                    {t(project.header)}
                  </h2>
                  <p className="font-neue text-lg md:text-xl leading-relaxed text-white/80 mb-8">
                    {t(project.description)}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 text-sm md:text-base">
                  <div>
                    <h3 className="font-nord font-bold mb-2 text-white/60 uppercase tracking-wider">
                      Date
                    </h3>
                    <p className="font-neue text-white">{t(project.date)}</p>
                  </div>
                  <div>
                    <h3 className="font-nord font-bold mb-2 text-white/60 uppercase tracking-wider">
                      Client
                    </h3>
                    <p className="font-neue text-white">{t(project.client)}</p>
                  </div>
                  <div>
                    <h3 className="font-nord font-bold mb-2 text-white/60 uppercase tracking-wider">
                      Role
                    </h3>
                    <p className="font-neue text-white">{t(project.role)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};
