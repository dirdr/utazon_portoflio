import { useEffect } from "react";
import { useBackgroundStore } from "./useBackgroundStore";
import { Project } from "../types/project";

export const useProjectBackground = (project: Project | null) => {
  const setBackgroundImage = useBackgroundStore(
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

