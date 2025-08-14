import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { ROUTES } from "../../constants/routes";
import { useTranslation } from "react-i18next";
import { useIsMobileHome } from "../../hooks/useIsMobileHome";
import { FullscreenVideoModal } from "../common/FullscreenVideoModal";

export const Home = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobileHome();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Memoize title content to avoid repeated string operations
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
          <address className="not-italic">
            <p className="text-lg sm:text-xl md:text-2xl text-muted pb-2">
              Paris, France
            </p>
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
          <address className="not-italic">
            <p
              id="location-heading"
              className="sm:text-base md:text-lg xl:text-xl text-muted mb-6"
            >
              Paris, France
            </p>
          </address>
          <LineSweepText
            className="font-nord text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl italic text-muted tracking-tight leading-14"
            duration={6}
          >
            {titleContent}
          </LineSweepText>
        </section>

        <section className="w-140" aria-labelledby="intro-heading">
          <div className="space-y-4">
            <p
              id="intro-heading"
              className="text-lg xl:text-xl 2xl:text-2xl text-gray mb-10"
            >
              {t("home.description")}
            </p>
            <nav className="flex gap-8" aria-label="Actions principales">
              <Button
                as="link"
                glintOnHover={true}
                href={ROUTES.PROJECTS}
                className="sm:text-base md:text-lg xl:text-xl"
              >
                {t("home.projects")}
              </Button>
              <Button
                as="button"
                glintOnHover={true}
                onClick={handleShowreelClick}
                className="sm:text-base md:text-lg xl:text-xl"
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
