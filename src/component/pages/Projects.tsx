import { Card } from "../common/Card";
import { allProjectsSortedByPriority } from "../../data/projects";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { useMemo } from "react";

export const Projects = () => {
  const { t } = useTranslation();


  // Memoize the translated project data to prevent re-renders
  const translatedProjects = useMemo(() => {
    return allProjectsSortedByPriority.map((project) => ({
      ...project,
      translatedTitle: t(project.title),
      translatedHeader: t(project.header),
      translatedDate: t(project.date),
    }));
  }, [t]);

  return (
    <Container variant="fluid" className="pt-12 lg:pt-16 pb-16 lg:pb-24">
      <main>
        <section aria-labelledby="projects-heading">
          <h1 id="projects-heading" className="sr-only">
            Projects
          </h1>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 card-container">
            {translatedProjects.map((project, index) => (
              <Card
                key={project.id}
                image={{
                  src: `/images/projects/${project.id}/cover.webp`,
                  alt: project.translatedTitle,
                }}
                project={{
                  id: project.id,
                  name: project.translatedTitle,
                  header: project.translatedHeader,
                  date: project.translatedDate,
                }}
                thumbnail={
                  project.hasVideo !== false
                    ? {
                        src: `/videos/projects/${project.id}/thumbnail.webm`,
                        alt: project.translatedTitle,
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