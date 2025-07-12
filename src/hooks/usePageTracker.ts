import { useEffect } from "react";
import { useLocation } from "wouter";
import { useVideo } from "../contexts/video";

export const usePageTracker = () => {
  const [location] = useLocation();
  const { setCurrentPage } = useVideo();

  useEffect(() => {
    setCurrentPage(location);
  }, [location, setCurrentPage]);
};

