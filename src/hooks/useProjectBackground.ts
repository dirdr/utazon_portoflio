import { useEffect } from 'react';
import { useBackground } from '../context/BackgroundContext';
import { Project } from '../types/project';

export const useProjectBackground = (project: Project | null) => {
  const { setBackgroundImage } = useBackground();

  useEffect(() => {
    if (project) {
      // Use standardized background.webp naming convention
      setBackgroundImage(`/images/projects/${project.id}/background.webp`);
    } else {
      // Clear background when no project
      setBackgroundImage(null);
    }

    // Cleanup function to clear background when component unmounts
    return () => {
      setBackgroundImage(null);
    };
  }, [project, setBackgroundImage]);
};