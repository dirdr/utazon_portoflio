import { useEffect } from "react";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { ROUTES } from "../../constants/routes";
import { useTranslation } from "react-i18next";

export const Home = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbars");
    return () => {
      document.documentElement.classList.remove("hide-scrollbars");
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col justify-end p-12 pb-16">
      <div className="flex justify-between items-end">
        <section className="w-165" aria-labelledby="location-heading">
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

        <section className="w-140" aria-labelledby="intro-heading">
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
    </div>
  );
};
