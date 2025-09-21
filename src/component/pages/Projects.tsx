import { Card } from "../common/Card";
import { allProjectsSortedByPriority } from "../../data/projects";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { useEffect } from "react";
import backgroundImage from "../../assets/images/background.webp";
import backgroundMobileImage from "../../assets/images/background_mobile.png";
import { isMobile } from "../../utils/mobileDetection";

export const Projects = () => {
  const { t } = useTranslation();
  const setBackgroundImage = useBackgroundImageStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    const currentBackgroundImage = isMobile()
      ? backgroundMobileImage
      : backgroundImage;
    setBackgroundImage(currentBackgroundImage, "Projects");
    return () => setBackgroundImage(null, "Projects");
  }, [setBackgroundImage]);

  return (
    <Container variant="fluid" className="pt-12 lg:pt-16 pb-24 lg:pb-32">
      <main>
        <section aria-labelledby="projects-heading">
          <h1 id="projects-heading" className="sr-only">
            Projects
          </h1>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 card-container">
            {allProjectsSortedByPriority.map((project, index) => (
              <Card
                key={project.id}
                image={{
                  src: `/images/projects/${project.id}/cover.webp`,
                  alt: t(project.title),
                }}
                project={{
                  id: project.id,
                  name: t(project.title),
                  header: t(project.header),
                  date: t(project.date),
                }}
                thumbnail={
                  project.hasVideo !== false
                    ? {
                        src: `/videos/projects/${project.id}/thumbnail.webm`,
                        alt: t(project.title),
                      }
                    : undefined
                }
                priority={index < 4}
              />
            ))}
          </div>
        </section>
      </main>
    </Container>
  );
};
