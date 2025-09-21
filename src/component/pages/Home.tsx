import { useState, useMemo, useCallback } from "react";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { SoundPlayer } from "../common/SoundPlayer";
import { ROUTES } from "../../constants/routes";
import { useTranslation } from "react-i18next";
import { FullscreenVideoModal } from "../common/FullscreenVideoModal";
import { useTransitionContext } from "../../hooks/useTransitionContext";
import { useSoundStore } from "../../stores/soundStore";
import { isMobile } from "../../utils/mobileDetection";
import { Container } from "../layout/Container";

export const Home = () => {
  const { isSoundPlaying, toggleSound } = useSoundStore();
  const { t } = useTranslation();
  const { navigateWithTransition } = useTransitionContext();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  const handleProjectsClick = useCallback(() => {
    navigateWithTransition(ROUTES.PROJECTS);
  }, [navigateWithTransition]);

  if (isMobile()) {
    return (
      <Container
        variant="fluid"
        className="h-[100dvh] flex flex-col justify-end overflow-hidden pb-12"
      >
        <div className="flex flex-col">
          <address className="not-italic relative">
            <p className="paragraph text-muted mb-2">Paris, France</p>
          </address>
          <header>
            <h1 id="title-heading" className="HeroHeader mb-2">
              <LineSweepText duration={6}>{titleContent}</LineSweepText>
            </h1>
          </header>

          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="sr-only">
              Description
            </h2>
            <p className="paragraph mb-4">{t("home.description")}</p>
          </section>

          <div className="flex gap-4 md:gap-8 justify-start">
            <Button
              as="button"
              glintOnHover={true}
              onClick={handleProjectsClick}
              className="ButtonText"
              speed={3}
            >
              {t("home.projects")}
            </Button>
            <Button
              as="button"
              glintOnHover={true}
              onClick={handleShowreelClick}
              className="ButtonText"
              speed={3}
            >
              {t("nav.showreel")}
            </Button>
          </div>
        </div>
        <FullscreenVideoModal
          isOpen={isVideoModalOpen}
          onClose={handleVideoModalClose}
        />
      </Container>
    );
  }

  return (
    <Container
      variant="fluid"
      className="h-full flex flex-col justify-end pb-4 xl:pb-16"
    >
      <div className="flex justify-between items-end">
        <section className="w-165" aria-labelledby="location-heading">
          <address className="not-italic relative">
            <div className="flex flex-col gap-6 mb-6">
              <SoundPlayer
                onToggle={toggleSound}
                isPlaying={isSoundPlaying}
                className="self-start"
              />
              <p id="location-heading" className="paragraph text-muted">
                Paris, France
              </p>
            </div>
          </address>
          <h1 className="HeroHeader">
            <LineSweepText duration={8}>{titleContent}</LineSweepText>
          </h1>
        </section>

        <section className="w-120 2xl:w-140" aria-labelledby="intro-heading">
          <h2 id="intro-heading" className="sr-only">
            Introduction
          </h2>
          <p className="paragraph mb-8">{t("home.description")}</p>
          <nav className="flex gap-8" aria-label="Actions principales">
            <Button
              as="button"
              glintOnHover={true}
              onClick={handleProjectsClick}
              className="ButtonText"
              speed={3}
            >
              {t("home.projects")}
            </Button>
            <Button
              as="button"
              glintOnHover={true}
              onClick={handleShowreelClick}
              className="ButtonText"
              speed={3}
            >
              {t("nav.showreel")}
            </Button>
          </nav>
        </section>
      </div>
      <FullscreenVideoModal
        isOpen={isVideoModalOpen}
        onClose={handleVideoModalClose}
      />
    </Container>
  );
};
