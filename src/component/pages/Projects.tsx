import { Card } from "../common/Card";
import { allProjectsSortedByPriority } from "../../data/projects";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { useEffect, useMemo } from "react";
import backgroundImage from "../../assets/images/background.webp";
import { ScrollablePageWrapper } from "../common/ScrollablePageWrapper";
import { useTransitionContext } from "../../contexts/TransitionContext";

export const Projects = () => {
  const { t } = useTranslation();
  const setBackgroundImage = useBackgroundImageStore(
    (state) => state.setBackgroundImage,
  );

  // Access transition context (for future navigation if needed)
  const { navigateWithTransition } = useTransitionContext();

  useEffect(() => {
    setBackgroundImage(backgroundImage, "Projects");
    return () => setBackgroundImage(null, "Projects");
  }, [setBackgroundImage]);

  return (
    <ScrollablePageWrapper>
      <Container className="py-8 mb-10">
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
      </Container>
    </ScrollablePageWrapper>
  );
};
