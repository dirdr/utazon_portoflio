import { useTranslation } from "react-i18next";
import { Project } from "../../types/project";
import { Container } from "../layout/Container";
import { ImageWithLoading } from "../common/ImageWithLoading";
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
        <div className="relative h-[30vh] overflow-hidden">
          <ImageWithLoading
            src={`/images/projects/${project.id}/background.webp`}
            alt={t(project.title)}
            className="w-full h-full object-cover object-center scale-110 transform"
            placeholderClassName="w-full h-full"
          />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
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

      <div className="hidden lg:block h-[70vh] relative">
        <div className="absolute top-8 left-32 z-20">
          <BackButton to="/projects" />
        </div>

        <div className="absolute top-0 left-0 w-[70%] h-full overflow-hidden">
          <ImageWithLoading
            src={`/images/projects/${project.id}/background.webp`}
            alt={t(project.title)}
            className="w-full h-full object-cover opacity-60"
            placeholderClassName="w-full h-full"
          />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-300 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        </div>

        <div className="absolute top-0 right-0 w-[42%] h-full flex items-center">
          <Container>
            <div className="max-w-135">
              <div className="pl-8">
                <h1 className="font-nord text-2xl lg:text-3xl font-bold italic mb-1 text-white">
                  {t(project.title)}
                </h1>
                <h2 className="font-nord text-base lg:text-lg mb-8 font-thin text-white">
                  {t(project.header)}
                </h2>
                <p className="font-neue text-sm xl:text-base leading-relaxed text-gray mb-16">
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
          </Container>
        </div>
      </div>
    </section>
  );
};
