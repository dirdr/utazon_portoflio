import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { SoundPlayer } from "../common/SoundPlayer";
import { ROUTES } from "../../constants/routes";
import { useTranslation } from "react-i18next";
import { useIsMobileHome } from "../../hooks/useIsMobileHome";
import { FullscreenVideoModal } from "../common/FullscreenVideoModal";

export const Home = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobileHome();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

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

  const handleVideoModalClose = useCallback(() => {
    setIsVideoModalOpen(false);
  }, []);

  const handleShowreelClick = useCallback(() => {
    setIsVideoModalOpen(true);
  }, []);

  const handleSoundToggle = useCallback((isPlaying: boolean) => {
    setIsSoundPlaying(isPlaying);
    // Here you can add actual audio control logic
    console.log(`Sound ${isPlaying ? 'playing' : 'muted'}`);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbars");
    return () => {
      document.documentElement.classList.remove("hide-scrollbars");
    };
  }, []);

  if (isMobile) {
    return (
      <div className="h-full w-full flex flex-col justify-end px-4 lg:px-12 pb-8">
        <div className="flex flex-col ">
          <address className="not-italic relative">
            <div className="flex flex-col gap-2 pb-2">
              <SoundPlayer 
                onToggle={handleSoundToggle}
                initialPlaying={isSoundPlaying}
                className="self-start"
              />
              <p className="text-lg sm:text-xl md:text-2xl text-muted">
                Paris, France
              </p>
            </div>
          </address>
          <section aria-labelledby="title-heading">
            <LineSweepText
              className="font-nord text-3xl sm:text-4xl md:text-5xl italic text-muted tracking-tight leading-tight pb-4"
              duration={6}
            >
              {titleContent}
            </LineSweepText>
          </section>

          <section aria-labelledby="intro-heading">
            <p
              id="intro-heading"
              className="text-base sm:text-lg md:text-2xl text-gray pb-4 md:pb-8"
            >
              {t("home.description")}
            </p>
          </section>

          <div className="flex gap-4 md:gap-8 justify-start">
            <Button
              as="link"
              glintOnHover={true}
              href={ROUTES.PROJECTS}
              className="text-sm sm:text-base md:text-xl"
            >
              {t("home.projects")}
            </Button>
            <Button
              as="button"
              glintOnHover={true}
              onClick={handleShowreelClick}
              className="text-sm sm:text-base md:text-xl"
            >
              {t("nav.showreel")}
            </Button>
          </div>
        </div>
        <FullscreenVideoModal
          isOpen={isVideoModalOpen}
          onClose={handleVideoModalClose}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-end px-4 lg:px-12 pb-8 xl:pb-16">
      <div className="flex justify-between items-end">
        <section className="w-165" aria-labelledby="location-heading">
          <address className="not-italic relative">
            <div className="flex flex-col gap-3 mb-6">
              <SoundPlayer 
                onToggle={handleSoundToggle}
                initialPlaying={isSoundPlaying}
                className="self-start"
              />
              <p
                id="location-heading"
                className="text-base xl:text-lg text-muted"
              >
                Paris, France
              </p>
            </div>
          </address>
          <LineSweepText
            className="font-nord text-5xl italic text-muted tracking-tight "
            duration={8}
          >
            {titleContent}
          </LineSweepText>
        </section>

        <section className="w-140" aria-labelledby="intro-heading">
          <div className="space-y-4">
            <p
              id="intro-heading"
              className="text-base xl:text-lg text-gray mb-10"
            >
              {t("home.description")}
            </p>
            <nav className="flex gap-8" aria-label="Actions principales">
              <Button
                as="link"
                glintOnHover={true}
                href={ROUTES.PROJECTS}
                className="text-sm lg:text-base"
              >
                {t("home.projects")}
              </Button>
              <Button
                as="button"
                glintOnHover={true}
                onClick={handleShowreelClick}
                className="text-sm lg:text-base"
              >
                {t("nav.showreel")}
              </Button>
            </nav>
          </div>
        </section>
      </div>
      <FullscreenVideoModal
        isOpen={isVideoModalOpen}
        onClose={handleVideoModalClose}
      />
    </div>
  );
};
