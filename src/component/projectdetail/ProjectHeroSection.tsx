import { useTranslation } from "react-i18next";
import { Project } from "../../types/project";
import { Container } from "../layout/Container";
import { BackButton } from "../common/BackButton";

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

export const ProjectHeroSection = ({ project }: ProjectHeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full bg-black -mt-20 pt-20">
      <div className="lg:hidden absolute top-24 left-4 z-10">
        <BackButton to="/projects" />
      </div>

      <div className="lg:hidden">
        <div
          className="relative h-[50vh] overflow-hidden bg-cover bg-left bg-no-repeat"
          style={{
            backgroundImage: `url(/images/projects/${project.id}/background.webp)`,
          }}
        >
          {/* Top and bottom gradients */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          {/* Responsive right gradient */}
          <div
            className="absolute inset-y-0 right-0 w-2/5 sm:w-1/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 70%, black 100%)",
            }}
          />
        </div>

        {/* Separate Hero Content Section Below Image */}
        <div className="bg-black">
          <Container>
            <div className="pb-12">
              <h1 className="font-nord text-xl lg:text-2xl font-bold mb-2 text-white">
                {t(project.title)}
              </h1>
              <h2 className="font-nord text-lg md:text-xl mb-8 font-thin text-white">
                {t(project.header)}
              </h2>
              <p className="font-neue text-base md:text-lg leading-relaxed text-gray mb-8 md:mb-16">
                {t(project.description)}
              </p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 text-base">
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

      <div className="hidden lg:block h-[70vh] relative overflow-hidden">
        <div className="absolute inset-0 opacity-90">
          <div
            className="absolute inset-0 bg-cover bg-left bg-no-repeat"
            style={{
              backgroundImage: `url(/images/projects/${project.id}/background.webp)`,
            }}
          />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />
          <div
            className="absolute inset-y-0 right-0 w-1/2 lg:w-2/3 xl:w-3/4 2xl:w-4/5"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, transparent 15%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.9) 55%, black 75%)",
            }}
          />
        </div>

        <div className="absolute top-8 left-32 z-20">
          <BackButton to="/projects" />
        </div>

        <div className="absolute top-0 right-0 h-full flex items-center mr-4 lg:mr-32">
          <div className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl">
            <div className="pl-8 pr-4">
              <h1 className="font-nord text-4xl font-bold italic mb-1 text-white">
                {t(project.title)}
              </h1>
              <h2 className="font-nord lg:text-xl mb-8 font-thin text-white">
                {t(project.header)}
              </h2>
              <p className="font-neue text-base leading-relaxed text-gray mb-12 xl:mb-16">
                {t(project.description)}
              </p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 text-lg">
                  <div>
                    <h3 className="font-nord text-white uppercase">Date</h3>
                    <p className="font-neue text-gray text-sm xl:text-base">
                      {t(project.date)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-nord text-white uppercase">Client</h3>
                    <p className="font-neue text-gray  text-sm xl:text-base">
                      {t(project.client)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-nord text-white uppercase">Role</h3>
                    <p className="font-neue text-gray text-sm xl:text-base">
                      {t(project.role)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
