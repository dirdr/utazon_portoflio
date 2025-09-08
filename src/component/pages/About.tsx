import { useMemo } from "react";
import { LineSweepText } from "../common/LineSweepText";
import { ProjectVideoCard } from "../common/ProjectVideoCard";
import { VideoShowcase } from "../showcase/VideoShowcase";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { Button } from "../common/Button";
import { useContactModal } from "../../hooks/useContactModal";

export const About = () => {
  const { t } = useTranslation();

  const { openContactModal } = useContactModal();

  const titleContent = useMemo(() => {
    const title = t("about.title");
    return title.includes("\n")
      ? title.split("\n").map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))
      : title;
  }, [t]);

  return (
    <Container>
      <div className="h-full w-full flex flex-col justify-start pt-4 sm:pt-32">
        <section className="mb-8 sm:mb-12 lg:mb-16">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-16">
            <div className="mb-8 lg:mb-0" aria-labelledby="title-heading">
              <LineSweepText
                className="font-nord text-3xl md:text-4xl lg:text-5xl italic text-muted tracking-tight"
                duration={6}
              >
                {titleContent}
              </LineSweepText>
            </div>

            <div className="hidden lg:block"></div>

            <div
              className="flex items-start"
              aria-labelledby="about-description"
            >
              <div className="w-px bg-gray-600 mr-6 lg:mr-8 flex-shrink-0 self-stretch"></div>
              <p
                id="about-description"
                className="text-sm md:text-base xl:text-lg text-gray"
              >
                {t("about.description")}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-4 2xl:gap-8 mb-8 sm:mb-12 lg:mb-16">
          <ProjectVideoCard
            video={{
              src: "/videos/about/card1.mp4",
              alt: "Motion Design video",
            }}
            title={t("about.services.motionDesign.title")}
            description={t("about.services.motionDesign.description")}
          />
          <ProjectVideoCard
            video={{
              src: "/videos/about/card2.webm",
              alt: "Art Direction video",
            }}
            title={t("about.services.artDirection.title")}
            description={t("about.services.artDirection.description")}
          />
          <ProjectVideoCard
            video={{
              src: "/videos/about/card3.mp4",
              alt: "Editing & Compositing video",
            }}
            title={t("about.services.editingCompositing.title")}
            description={t("about.services.editingCompositing.description")}
          />
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 xl:grid-cols-3">
            <div className="flex flex-col">
              <div className="mb-4 xl:my-20">
                <LineSweepText
                  className="text-muted font-nord text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wide"
                  duration={6}
                >
                  {t("about.toolsMastered")}
                </LineSweepText>
              </div>

              <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-16">
                <div className="h-px bg-gray-600"></div>

                <div className="flex flex-gap-2 md:gap-3 lg:gap-2">
                  <span className="text-white font-medium text-base md:text-lg lg:text-2xl">
                    Cinema 4D,
                  </span>
                  <span className="text-white font-medium text-base md:text-lg lg:text-2xl">
                    Blender,
                  </span>
                  <span className="text-white font-medium text-base md:text-lg lg:text-2xl">
                    Unreal Engine 5
                  </span>
                </div>

                <div className="h-px bg-gray-600"></div>

                <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-2">
                  <span className="text-white font-medium text-base md:text-lg lg:text-2xl">
                    After Effects,
                  </span>
                  <span className="text-white font-medium text-base md:text-lg lg:text-2xl">
                    DaVinci Resolve
                  </span>
                </div>
                <div className="h-px bg-gray-600"></div>
              </div>
            </div>

            <div className="lg:col-span-2 w-full mt-8 lg:mt-0">
              <VideoShowcase
                data={{
                  type: "video",
                  id: "showreel-about",
                  order: 1,
                  video: {
                    src: "showreel.mp4",
                    title: "Showreel",
                    startTime: 0.3,
                  },
                }}
                border={true}
              />
            </div>
          </div>
          <div className="w-full my-32 lg:my-48">
            <div className="max-w-2xl mx-auto text-center">
              <LineSweepText
                className="text-muted font-nord text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wide mb-8"
                duration={4}
              >
                {t("about.commitment")}
              </LineSweepText>
              <p
                id="commitment-desc"
                className="text-white text-sm md:text-base xl:text-lg leading-relaxed mb-16"
              >
                {t("about.commitmentDesc")}
              </p>
              <div className="flex justify-center">
                <Button
                  glint={true}
                  as="button"
                  className="text-xs sm:text-sm md:text-base lg:text-lg px-8 py-3 inline-block w-auto"
                  onClick={openContactModal}
                  proximityIntensity={true}
                >
                  {t("nav.contact")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
