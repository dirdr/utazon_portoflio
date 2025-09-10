import { useCallback, useRef, useState } from 'react';
import { useIntersectionPreloader } from './useIntersectionPreloader';
import { isMobile } from '../utils/mobileDetection';

interface ProjectAssets {
  coverImage: string;
  backgroundImage: string;
  thumbnailVideo?: string;
}

interface ProjectGridPreloaderConfig {
  projectId: string;
  hasVideo?: boolean;
  rootMargin?: string;
  threshold?: number;
}

interface ProjectGridPreloaderResult {
  observeElement: (element: HTMLElement | null) => void;
  isIntersecting: boolean;
  assetsLoaded: boolean;
  loadProgress: number;
}

export const useProjectGridPreloader = (
  config: ProjectGridPreloaderConfig
): ProjectGridPreloaderResult => {
  const { projectId, hasVideo = true, rootMargin = '200px', threshold = 0.1 } = config;
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const loadedAssetsRef = useRef(new Set<string>());
  const loadingRef = useRef(false);

  const getProjectAssets = useCallback((): ProjectAssets => {
    const assets: ProjectAssets = {
      coverImage: `/images/projects/${projectId}/cover.webp`,
      backgroundImage: `/images/projects/${projectId}/background.webp`,
    };

    if (hasVideo && !isMobile()) {
      assets.thumbnailVideo = `/videos/projects/${projectId}/thumbnail.webm`;
    }

    return assets;
  }, [projectId, hasVideo]);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        loadedAssetsRef.current.add(url);
        resolve();
      };
      img.onerror = () => {
        loadedAssetsRef.current.add(url);
        resolve();
      };
      img.src = url;
    });
  }, []);

  const preloadVideo = useCallback((url: string): Promise<void> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      
      const handleReady = () => {
        loadedAssetsRef.current.add(url);
        video.remove();
        resolve();
      };
      
      video.addEventListener('loadedmetadata', handleReady, { once: true });
      video.addEventListener('error', handleReady, { once: true });
      
      setTimeout(handleReady, 3000);
      video.src = url;
    });
  }, []);

  const loadProjectAssets = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const assets = getProjectAssets();
    const assetEntries = Object.entries(assets).filter(([, url]) => url);
    const totalAssets = assetEntries.length;

    if (totalAssets === 0) {
      setAssetsLoaded(true);
      setLoadProgress(1);
      return;
    }

    const promises = assetEntries.map(async ([key, url]) => {
      if (loadedAssetsRef.current.has(url)) return;

      try {
        if (key === 'thumbnailVideo') {
          await preloadVideo(url);
        } else {
          await preloadImage(url);
        }
      } catch (error) {
        loadedAssetsRef.current.add(url);
      }

      const loadedCount = loadedAssetsRef.current.size;
      const progress = Math.min(loadedCount / totalAssets, 1);
      setLoadProgress(progress);

      if (progress >= 1) {
        setAssetsLoaded(true);
      }
    });

    await Promise.allSettled(promises);
    loadingRef.current = false;
  }, [getProjectAssets, preloadImage, preloadVideo]);

  const handleIntersection = useCallback(() => {
    loadProjectAssets();
  }, [loadProjectAssets]);

  const { observeElement, isIntersecting } = useIntersectionPreloader({
    rootMargin,
    threshold,
    onIntersect: handleIntersection,
  });

  return {
    observeElement,
    isIntersecting,
    assetsLoaded,
    loadProgress,
  };
};