import { useVideo } from "../../contexts/video";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { ROUTES } from "../../constants/routes";
import { useTranslation } from "react-i18next";

export const Home = () => {
  const { isLoading } = useVideo();
  const { t } = useTranslation();

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
        className="absolute bottom-0 pl-12 pb-16 w-180"
        aria-labelledby="location-heading"
      >
        <address className="not-italic">
          <p id="location-heading" className="text-muted text-lg mb-6">
            Paris, France
          </p>
        </address>
        <LineSweepText
          className="font-nord text-5xl italic text-muted"
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
          <p id="intro-heading" className="text-lg text-gray mb-10">
            {t("home.description")}
          </p>
          <nav className="flex gap-8" aria-label="Actions principales">
            <Button href={ROUTES.PROJECTS}>PROJETS</Button>
            <Button href={ROUTES.SHOWREEL}>SHOWREEL</Button>
          </nav>
        </div>
      </section>
    </main>
  );
};
