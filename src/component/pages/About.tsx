import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { useContactModal } from "../../hooks/useContactModal";
import { useLenis } from "../../hooks/useLenis";
import { VideoShowcase } from "../showcase/VideoShowcase";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { Container } from "../layout/Container";
import { logoRendered } from "../../hooks/usePreloadAssets";

export const About = () => {
  const [planeOpaque] = useState(false);
  const [bloomEnabled] = useState(true);
  const { t } = useTranslation();
  const { setBackground } = useBackgroundImageStore();

  const { openContactModal } = useContactModal();
  const { scrollTo } = useLenis();

  const scrollToShowreel = () => {
    scrollTo('[data-id="showreel-about"]', {
      offset: -200,
      duration: 1.5,
    });
  };

  useEffect(() => {
    setBackground(
      {
        type: "three",
        value: "about-logo",
        options: {
          planeOpaque,
          bloomEnabled,
        },
      },
      "About",
      "/about",
    );

    return () => setBackground(null, "About");
  }, [setBackground, planeOpaque, bloomEnabled]);

  return (
    <>
      {/* Desktop version - xl and above */}
      <div className="mb-32 hidden xl:block">
        <div className="relative w-full h-screen">
          <Container
            variant="constrained"
            maxWidth="screen-4xl"
            className="h-full"
          >
            <div className="relative h-full">
              <div className="absolute top-64 left-0 pointer-events-auto max-w-lg">
                <header className="mb-8">
                  <h1 className="HeroHeader">
                    <LineSweepText duration={6}>
                      {t("about.title")}
                    </LineSweepText>
                  </h1>
                </header>

                <p className="paragraph mb-10">{t("home.description")}</p>

                <div className="flex justify-start">
                  <Button
                    glint={true}
                    as="button"
                    className="ButtonText"
                    onClick={scrollToShowreel}
                    proximityIntensity={true}
                  >
                    {t("nav.showreel")}
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-32 right-0 pointer-events-auto max-w-md">
                <h2 className="SectionTitle mb-2">
                  {t("about.services.motionDesign.title")}
                </h2>
                <p className="paragraph">
                  {t("about.services.motionDesign.description")}
                </p>
                <div className="h-px bg-border my-10"></div>

                <h2 className="SectionTitle mb-2">
                  {t("about.services.artDirection.title")}
                </h2>
                <p className="paragraph">
                  {t("about.services.artDirection.description")}
                </p>
                <div className="h-px bg-border my-10"></div>

                <h2 className="SectionTitle mb-2">
                  {t("about.services.editingCompositing.title")}
                </h2>
                <p className="paragraph">
                  {t("about.services.editingCompositing.description")}
                </p>
                <div className="h-px bg-border my-10"></div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Mobile version - xl and below */}
      <div className="xl:hidden">
        {/* Mobile logo section */}
        <div className="w-full h-96 sm:h-[28rem] flex items-center justify-center">
          <img
            src={logoRendered}
            alt="Logo"
            className="w-full h-full object-contain px-8"
          />
        </div>

        {/* Hero content section */}
        <Container variant="fluid" className="px-4">
          <header className="mb-6">
            <h1 className="HeroHeader">
              <LineSweepText duration={6}>{t("about.title")}</LineSweepText>
            </h1>
          </header>

          <p className="paragraph mb-6">{t("home.description")}</p>

          <div className="flex justify-start">
            <Button
              glint={true}
              as="button"
              className="ButtonText"
              onClick={scrollToShowreel}
              proximityIntensity={true}
            >
              {t("nav.showreel")}
            </Button>
          </div>
        </Container>

        {/* Services section */}
        <Container variant="fluid" className="px-4 my-16">
          <div className="space-y-8">
            <div>
              <h2 className="SectionTitle mb-2">
                {t("about.services.motionDesign.title")}
              </h2>
              <p className="paragraph">
                {t("about.services.motionDesign.description")}
              </p>
              <div className="h-px bg-border my-8"></div>
            </div>

            <div>
              <h2 className="SectionTitle mb-2">
                {t("about.services.artDirection.title")}
              </h2>
              <p className="paragraph">
                {t("about.services.artDirection.description")}
              </p>
              <div className="h-px bg-border my-8"></div>
            </div>

            <div>
              <h2 className="SectionTitle mb-2">
                {t("about.services.editingCompositing.title")}
              </h2>
              <p className="paragraph">
                {t("about.services.editingCompositing.description")}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* VideoShowcase section */}
      <Container variant="constrained" className="px-4 lg:px-32 my-16">
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
        <section className="my-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="PageTitle">
              <LineSweepText duration={6}>
                {t("about.commitment")}
              </LineSweepText>
            </h2>
            <p className="paragraph text-white my-8">
              {t("about.commitmentDesc")}
            </p>
            <div className="flex justify-center">
              <Button
                glint={true}
                as="button"
                className="ButtonText"
                onClick={openContactModal}
                proximityIntensity={true}
              >
                {t("nav.contact")}
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
};
