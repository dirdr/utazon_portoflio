import { useEffect } from "react";
import { useLocation } from "wouter";
import { useVideo } from "../contexts/VideoContext";

export const usePageTracker = () => {
  const [location] = useLocation();
  const { setCurrentPage } = useVideo();

  useEffect(() => {
    setCurrentPage(location);
  }, [location, setCurrentPage]);
};

