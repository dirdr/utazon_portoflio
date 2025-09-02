import { useEffect } from "react";
import { useBackgroundImageStore } from "./useBackgroundImageStore";
import { Project } from "../types/project";

export const useProjectBackground = (project: Project | null) => {
  const setBackgroundImage = useBackgroundImageStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    if (project) {
      setBackgroundImage(`/images/projects/${project.id}/background.webp`);
    } else {
      setBackgroundImage(null);
    }

    return () => {
      setBackgroundImage(null);
    };
  }, [project, setBackgroundImage]);
};

