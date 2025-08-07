import { useEffect } from "react";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { ROUTES } from "../../constants/routes";
import { useTranslation } from "react-i18next";
import { useIsMobileHome } from "../../hooks/useIsMobileHome";

export const Home = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobileHome();

  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbars");
    return () => {
      document.documentElement.classList.remove("hide-scrollbars");
    };
  }, []);

  if (isMobile) {
    return (
      <div className="h-full w-full flex flex-col justify-end px-12 pb-8">
        <div className="flex flex-col ">
          <address className="not-italic">
            <p className="text-lg text-muted pb-2">Paris, France</p>
          </address>
          <section aria-labelledby="title-heading">
            <LineSweepText
              className="font-nord text-4xl italic text-muted tracking-tight leading-tight pb-4"
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

          <section aria-labelledby="intro-heading">
            <p id="intro-heading" className="text-lg text-gray pb-8">
              {t("home.description")}
            </p>
          </section>

          <div className="flex gap-4 justify-start">
            <Button
              as="link"
              glintOnHover={true}
              href={ROUTES.PROJECTS}
              className="text-base"
            >
              {t("home.projects")}
            </Button>
            <Button
              as="link"
              glintOnHover={true}
              href={ROUTES.SHOWREEL}
              className="text-base"
            >
              {t("nav.showreel")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-end px-12 pb-16">
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
