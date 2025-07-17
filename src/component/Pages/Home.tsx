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
    <main className="relative w-full h-screen">
      <section
        className="absolute bottom-0 pl-12 pb-16 w-165"
        aria-labelledby="location-heading"
      >
        <address className="not-italic">
          <p id="location-heading" className="text-muted mb-6">
            Paris, France
          </p>
        </address>
        <LineSweepText
          className="font-nord text-5xl italic text-muted tracking-tight leading-14"
          duration={6}
        >
          3D Artist and Motion Designer
        </LineSweepText>
      </section>

      <section
        className="absolute bottom-0 right-0 w-125 pb-16 pr-12"
        aria-labelledby="intro-heading"
      >
        <div className="space-y-4">
          <p id="intro-heading" className="text text-gray mb-10">
            {t("home.description")}
          </p>
          <nav className="flex gap-4 text-xs" aria-label="Actions principales">
            <Button as="link" glintOnHover={true} href={ROUTES.PROJECTS}>
              PROJETS
            </Button>
            <Button as="link" glintOnHover={true} href={ROUTES.SHOWREEL}>
              SHOWREEL
            </Button>
          </nav>
        </div>
      </section>
    </main>
  );
};
