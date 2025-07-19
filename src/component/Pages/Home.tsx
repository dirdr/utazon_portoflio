import { useEffect } from "react";
import { useVideo } from "../../contexts/video";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { ROUTES } from "../../constants/routes";
import { useTranslation } from "react-i18next";

export const Home = () => {
  const { isLoading } = useVideo();
  const { t } = useTranslation();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      html {
        overflow-x: hidden;
        scrollbar-width: none; /* Firefox */
      }
      html::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Edge */
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <section
        className="absolute bottom-0 pl-12 pb-16 w-165"
        aria-labelledby="location-heading"
      >
        <address className="not-italic">
          <p id="location-heading" className="text-lg text-muted mb-6">
            Paris, France
          </p>
        </address>
        <LineSweepText
          className="font-nord text-6xl italic text-muted tracking-tight leading-14"
          duration={6}
        >
          {t("home.title").includes("\n")
            ? t("home.title")
                .split("\n")
                .map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))
            : t("home.title")}
        </LineSweepText>
      </section>

      <section
        className="absolute bottom-0 right-0 w-140 pb-16 pr-12"
        aria-labelledby="intro-heading"
      >
        <div className="space-y-4">
          <p id="intro-heading" className="text-xl text-gray mb-10">
            {t("home.description")}
          </p>
          <nav className="flex gap-8" aria-label="Actions principales">
            <Button
              as="link"
              glintOnHover={true}
              href={ROUTES.PROJECTS}
              className="text-lg"
            >
              {t("home.projects")}
            </Button>
            <Button
              as="link"
              glintOnHover={true}
              href={ROUTES.SHOWREEL}
              className="text-lg"
            >
              {t("nav.showreel")}
            </Button>
          </nav>
        </div>
      </section>
    </div>
  );
};
