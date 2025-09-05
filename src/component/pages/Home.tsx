import { useState, useMemo, useCallback } from "react";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { SoundPlayer } from "../common/SoundPlayer";
import { ROUTES } from "../../constants/routes";
import { useTranslation } from "react-i18next";
import { useHomeMobileBreakpoint } from "../../hooks/useHomeMobileBreakpoint";
import { FullscreenVideoModal } from "../common/FullscreenVideoModal";
import { useTransitionContext } from "../../hooks/useTransitionContext";

interface HomeProps {
  onVideoMuteToggle?: (muted: boolean) => void;
}

export const Home = ({ onVideoMuteToggle }: HomeProps) => {
  const { t } = useTranslation();
  const isMobile = useHomeMobileBreakpoint();
  const { navigateWithTransition } = useTransitionContext();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [, setIsSoundPlaying] = useState(true);

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

  const handleSoundToggle = useCallback(
    (isPlaying: boolean) => {
      setIsSoundPlaying(isPlaying);
      onVideoMuteToggle?.(!isPlaying);
    },
    [onVideoMuteToggle],
  );

  const handleProjectsClick = useCallback(() => {
    navigateWithTransition(ROUTES.PROJECTS);
  }, [navigateWithTransition]);


  if (isMobile) {
    return (
      <div className="h-full w-full flex flex-col justify-end px-4 lg:px-12 pb-8">
        <div className="flex flex-col ">
          <address className="not-italic relative">
            <SoundPlayer
              onToggle={handleSoundToggle}
              initialPlaying={true}
              className="self-start mb-2"
            />
            <p className="text-base sm:text-lg md:text-xl text-muted mb-2">
              Paris, France
            </p>
          </address>
          <section aria-labelledby="title-heading">
            <LineSweepText
              className="font-nord text-2xl sm:text-3xl md:text-4xl italic text-muted tracking-tight leading-tight mb-2"
              duration={6}
            >
              {titleContent}
            </LineSweepText>
          </section>

          <section aria-labelledby="intro-heading">
            <p
              id="intro-heading"
              className="text-sm sm:text-base text-gray mb-4"
            >
              {t("home.description")}
            </p>
          </section>

          <div className="flex gap-4 md:gap-8 justify-start">
            <Button
              as="button"
              glintOnHover={true}
              onClick={handleProjectsClick}
              className="text-xs sm:text-base"
            >
              {t("home.projects")}
            </Button>
            <Button
              as="button"
              glintOnHover={true}
              onClick={handleShowreelClick}
              className="text-xs sm:text-base"
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
                initialPlaying={true}
                className="self-start mb-6"
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
                as="button"
                glintOnHover={true}
                onClick={handleProjectsClick}
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
