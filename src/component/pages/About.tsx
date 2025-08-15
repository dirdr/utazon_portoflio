import { useEffect, useMemo } from "react";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { Container } from "../layout/Container";
import { LineSweepText } from "../common/LineSweepText";
import { VideoCard } from "../common/VideoCard";
import { VideoShowcase } from "../showcase/VideoShowcase";
import { useTranslation } from "react-i18next";
import backgroundImage from "../../assets/images/background.webp";

export const About = () => {
  const { t } = useTranslation();
  const setBackgroundImage = useBackgroundStore(
    (state) => state.setBackgroundImage,
  );

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

  useEffect(() => {
    setBackgroundImage(backgroundImage, "About");
    return () => setBackgroundImage(null, "About");
  }, [setBackgroundImage]);

  return (
    <div className="h-full w-full flex flex-col justify-start px-4 lg:px-12 pt-32">
      {/* First row */}
      <div className="grid grid-cols-3 gap-8 items-start mb-16">
        <section className="" aria-labelledby="title-heading">
          <LineSweepText
            className="font-nord text-3xl lg:text-4xl italic text-muted tracking-tight "
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
          <p id="about-description" className="text-base xl:text-lg text-gray">
            {t("about.description")}
          </p>
        </section>
      </div>

      {/* Second row - Video cards */}
      <div className="grid grid-cols-3 gap-8 mb-16">
        <VideoCard
          video={{
            src: "/videos/about/card1.webm",
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
            src: "/videos/about/card3.webm",
            alt: "Editing & Compositing video",
          }}
          title={t("about.services.editingCompositing.title")}
          description={t("about.services.editingCompositing.description")}
        />
      </div>

      {/* Third row - Video showcase */}
      <div className="grid grid-cols-3 gap-8">
        <div></div>
        <div className="col-span-2">
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
          />
        </div>
      </div>
    </div>
  );
};
