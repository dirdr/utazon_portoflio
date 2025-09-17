import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { useContactModal } from "../../hooks/useContactModal";
import { VideoShowcase } from "../showcase/VideoShowcase";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";

export const NewAbout = () => {
  const [planeOpaque] = useState(false);
  const [bloomEnabled] = useState(true);
  const { t } = useTranslation();
  const { setBackground } = useBackgroundImageStore();

  const titleContent = useMemo(() => {
    const title = t("home.title");
    return title.includes("\n")
      ? title.split("\n").map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))
      : title;
  }, [t]);

  const { openContactModal } = useContactModal();

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
      "NewAbout",
    );

    return () => setBackground(null, "NewAbout");
  }, [setBackground, planeOpaque, bloomEnabled]);

  return (
    <>
      {/* Desktop version - xl and above */}
      <div className="mb-32 hidden xl:block">
        <div className="relative w-full h-screen">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-64 left-12 2xl:left-48 pointer-events-auto max-w-md">
              <header className="mb-8">
                <h1 className="font-nord text-3xl xl:text-4xl italic text-muted tracking-tight">
                  <LineSweepText duration={6}>{titleContent}</LineSweepText>
                </h1>
              </header>

              <p className="text-base text-gray mb-10">
                {t("home.description")}
              </p>

              <div className="flex justify-start">
                <Button
                  glint={true}
                  as="button"
                  className="text-xs sm:text-base px-8 py-3 inline-block w-auto"
                  onClick={openContactModal}
                  proximityIntensity={true}
                >
                  {t("nav.contact")}
                </Button>
              </div>
            </div>
            <div className="absolute bottom-32 right-12 2xl:right-48 pointer-events-auto max-w-md">
              <h2 className="text-white text-sm 2xl-test-base font-nord mb-2">
                {t("about.services.motionDesign.title")}
              </h2>
              <p className="text-muted text-base 2xl-test-lg font-neue">
                {t("about.services.motionDesign.description")}
              </p>
              <div className="h-px bg-gray-400/30 my-10"></div>

              <h2 className="text-white text-sm 2xl-test-base font-nord mb-2">
                {t("about.services.artDirection.title")}
              </h2>
              <p className="text-muted text-base 2xl-test-lg font-neue">
                {t("about.services.artDirection.description")}
              </p>
              <div className="h-px bg-gray-400/30 my-10"></div>

              <h2 className="text-white text-sm 2xl-test-base font-nord mb-2">
                {t("about.services.editingCompositing.title")}
              </h2>
              <p className="text-muted text-base 2xl-test-lg font-neue">
                {t("about.services.editingCompositing.description")}
              </p>
              <div className="h-px bg-gray-400/30 my-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile version - xl and below */}
      <div className="mb-32 xl:hidden">
        <div className="relative w-full min-h-screen">
          {/* Logo area with spacer for Three.js background - adjusted for fixed navbar */}
          <div className="h-[calc(35vh-2rem)] min-h-[128px] w-full mt-16"></div>

          {/* Main content - positioned below the logo with proper spacing */}
          <div className="px-6 sm:px-8 md:px-12 mt-20 sm:mt-24">
            <header className="mb-8">
              <h1 className="font-nord text-2xl sm:text-3xl italic text-muted tracking-tight">
                <LineSweepText duration={6}>{titleContent}</LineSweepText>
              </h1>
            </header>

            <p className="text-base text-gray mb-10">{t("home.description")}</p>

            <div className="flex justify-start mb-16">
              <Button
                glint={true}
                as="button"
                className="text-sm px-8 py-3 inline-block w-auto"
                onClick={openContactModal}
                proximityIntensity={true}
              >
                {t("nav.contact")}
              </Button>
            </div>

            {/* Services section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-white text-sm font-nord mb-2">
                  {t("about.services.motionDesign.title")}
                </h2>
                <p className="text-muted text-base font-neue">
                  {t("about.services.motionDesign.description")}
                </p>
                <div className="h-px bg-gray-400/30 my-8"></div>
              </div>

              <div>
                <h2 className="text-white text-sm font-nord mb-2">
                  {t("about.services.artDirection.title")}
                </h2>
                <p className="text-muted text-base font-neue">
                  {t("about.services.artDirection.description")}
                </p>
                <div className="h-px bg-gray-400/30 my-8"></div>
              </div>

              <div>
                <h2 className="text-white text-sm font-nord mb-2">
                  {t("about.services.editingCompositing.title")}
                </h2>
                <p className="text-muted text-base font-neue">
                  {t("about.services.editingCompositing.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 lg:mx-32">
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
        <div className="flex-1 flex items-center justify-center mt-10">
          <p className="text-muted text-base 2xl:text-lg font-neue">
            Cinema 4D, Blender, Unreal Engine 5, After Effects, DaVinci Resolve
          </p>
        </div>
        <section className="my-48 lg:my-64">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-muted font-nord text-xl 2xl:text:2xl italic font-bold tracking-wide">
              <LineSweepText duration={6}>
                {t("about.commitment")}
              </LineSweepText>
            </h2>
            <p className="text-white text-base 2xl:text-lg leading-relaxed my-16">
              {t("about.commitmentDesc")}
            </p>
            <div className="flex justify-center">
              <Button
                glint={true}
                as="button"
                className="text-sm 2xl:text-base px-8 py-3 inline-block w-auto"
                onClick={openContactModal}
                proximityIntensity={true}
              >
                {t("nav.contact")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
