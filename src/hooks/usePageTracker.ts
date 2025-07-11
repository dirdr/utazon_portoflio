import { useEffect } from "react";
import { useLocation } from "wouter";
import { useVideo } from "../component/common/VideoContext";

export const usePageTracker = () => {
  const [location] = useLocation();
  const { setCurrentPage } = useVideo();

  useEffect(() => {
    setCurrentPage(location);
  }, [location, setCurrentPage]);
};