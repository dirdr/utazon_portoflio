import { useMemo } from "react";
import { LineSweepText } from "../common/LineSweepText";
import { VideoCard } from "../common/VideoCard";
import { VideoShowcase } from "../showcase/VideoShowcase";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";

export const About = () => {
  const { t } = useTranslation();

  const titleContent = useMemo(() => {
    const title = t("about.title");
    return title.includes("\n")
      ? title.split("\n").map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))
      : title;
  }, [t]);

  return (
    <Container>
      <div className="h-full w-full flex flex-col justify-start pt-32">
        <div className="grid grid-cols-3 gap-8 items-start mb-16">
          <section className="" aria-labelledby="title-heading">
            <LineSweepText
              className="font-nord text-4xl lg:text-5xl italic text-muted tracking-tight "
              duration={6}
            >
              {titleContent}
            </LineSweepText>
          </section>

          <div></div>

          <section
            className="flex items-start"
            aria-labelledby="about-description"
          >
            <div className="w-px bg-gray-600 mr-8 flex-shrink-0 self-stretch"></div>
            <p
              id="about-description"
              className="text-base xl:text-lg text-gray"
            >
              {t("about.description")}
            </p>
          </section>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-16">
          <VideoCard
            video={{
              src: "/videos/about/card1.mp4",
              alt: "Motion Design video",
            }}
            title={t("about.services.motionDesign.title")}
            description={t("about.services.motionDesign.description")}
          />
          <VideoCard
            video={{
              src: "/videos/about/card2.webm",
              alt: "Art Direction video",
            }}
            title={t("about.services.artDirection.title")}
            description={t("about.services.artDirection.description")}
          />
          <VideoCard
            video={{
              src: "/videos/about/card3.mp4",
              alt: "Editing & Compositing video",
            }}
            title={t("about.services.editingCompositing.title")}
            description={t("about.services.editingCompositing.description")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start justify-start">
            <h2 className="text-white font-nord text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wide">
              {t("about.toolsMastered")}
            </h2>
          </div>
          <div className="md:col-span-2 w-full">
            <VideoShowcase
              data={{
                type: "video",
                id: "showreel-about",
                order: 1,
                video: {
                  src: "showreel.mp4",
                  title: "Showreel",
                  light: null,
                },
              }}
              border={true}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
