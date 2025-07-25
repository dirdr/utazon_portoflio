import { Card } from "../common/Card";
import { allProjectsSortedByPriority } from "../../data/projects";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { useEffect } from "react";
import backgroundImage from "../../assets/images/background.webp";

export const Projects = () => {
  const { t } = useTranslation();
  const setBackgroundImage = useBackgroundStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    setBackgroundImage(backgroundImage, 'Projects');
    return () => setBackgroundImage(null, 'Projects');
  }, [setBackgroundImage]);

  return (
    <Container className="py-8">
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
            thumbnail={{
              src: `/videos/projects/${project.id}/thumbnail.webm`,
              alt: t(project.title),
            }}
            priority={index < 4}
          />
        ))}
      </div>
    </Container>
  );
};
