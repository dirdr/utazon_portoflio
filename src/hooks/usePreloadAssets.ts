import { useCallback, useEffect, useState } from "react";
import { allProjectsSortedByPriority } from "../data/projects";
import backgroundImage from "../assets/images/background.webp";
import p1 from "../assets/images/card_backgrounds/1.webp";
import p2 from "../assets/images/card_backgrounds/2.webp";
import p3 from "../assets/images/card_backgrounds/3.webp";

export interface AssetLoadState {
  url: string;
  loaded: boolean;
  error: boolean;
  type: "image" | "video";
}

export interface PreloadState {
  assets: AssetLoadState[];
  totalAssets: number;
  loadedAssets: number;
  failedAssets: number;
  isComplete: boolean;
  progress: number;
}

/**
 * hook to preload all heavyeight assets
 */
export const usePreloadAssets = () => {
  const [state, setState] = useState<PreloadState>({
    assets: [],
    totalAssets: 0,
    loadedAssets: 0,
    failedAssets: 0,
    isComplete: false,
    progress: 0,
  });

  const generateAssetsList = useCallback((): AssetLoadState[] => {
    const assets: AssetLoadState[] = [];

    assets.push({
      url: `/videos/intro.mp4`,
      loaded: false,
      error: false,
      type: "video",
    });

    assets.push({
      url: `/videos/intro_mobile.mp4`,
      loaded: false,
      error: false,
      type: "video",
    });

    assets.push({
      url: backgroundImage,
      loaded: false,
      error: false,
      type: "image",
    });

    assets.push({
      url: p1,
      loaded: false,
      error: false,
      type: "image",
    });

    assets.push({
      url: p2,
      loaded: false,
      error: false,
      type: "image",
    });

    assets.push({
      url: p3,
      loaded: false,
      error: false,
      type: "image",
    });

    allProjectsSortedByPriority.forEach((project) => {
      assets.push({
        url: `/images/projects/${project.id}/cover.webp`,
        loaded: false,
        error: false,
        type: "image",
      });

      assets.push({
        url: `/images/projects/${project.id}/background.webp`,
        loaded: false,
        error: false,
        type: "image",
      });

      if (project.hasVideo !== false) {
        assets.push({
          url: `/videos/projects/${project.id}/thumbnail.webm`,
          loaded: false,
          error: false,
          type: "video",
        });
      }
    });

    return assets;
  }, []);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.decoding = "async";
      img.loading = "eager";

      const handleLoad = () => {
        cleanup();
        resolve();
      };

      const handleError = () => {
        cleanup();
        reject(new Error(`Failed to load image: ${url}`));
      };

      const cleanup = () => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleError);
      };

      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);

      img.src = url;

      setTimeout(() => {
        if (!img.complete) {
          console.warn(`Image preload timeout for: ${url}`);
          cleanup();
          resolve();
        }
      }, 10000);
    });
  }, []);

  const preloadVideo = useCallback((url: string): Promise<void> => {
    return new Promise((resolve) => {
      fetch(url, {
        method: "HEAD",
        mode: "cors",
        cache: "no-cache",
      })
        .then((response) => {
          if (
            !response.ok ||
            !response.headers.get("content-type")?.includes("video")
          ) {
            resolve();
            return;
          }

          const video = document.createElement("video");
          let resolved = false;

          const timeoutId = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve();
            }
          }, 3000);

          const handleSuccess = () => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve();
            }
          };

          const handleError = () => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve();
            }
          };

          const cleanup = () => {
            video.removeEventListener("loadedmetadata", handleSuccess);
            video.removeEventListener("canplay", handleSuccess);
            video.removeEventListener("error", handleError);
            video.src = "";
            clearTimeout(timeoutId);
          };

          video.addEventListener("loadedmetadata", handleSuccess);
          video.addEventListener("canplay", handleSuccess);
          video.addEventListener("error", handleError);

          video.preload = "metadata";
          video.muted = true;
          video.src = url;
        })
        .catch(() => {
          resolve();
        });
    });
  }, []);

  const updateAssetState = useCallback(
    (url: string, loaded: boolean, error: boolean) => {
      setState((prevState) => {
        const updatedAssets = prevState.assets.map((asset) =>
          asset.url === url ? { ...asset, loaded, error } : asset,
        );

        const loadedCount = updatedAssets.filter(
          (asset) => asset.loaded,
        ).length;
        const failedCount = updatedAssets.filter((asset) => asset.error).length;
        const progress = (loadedCount + failedCount) / updatedAssets.length;
        const isComplete = progress === 1;

        return {
          ...prevState,
          assets: updatedAssets,
          loadedAssets: loadedCount,
          failedAssets: failedCount,
          progress,
          isComplete,
        };
      });
    },
    [],
  );

  const preloadAsset = useCallback(
    async (asset: AssetLoadState) => {
      try {
        if (asset.type === "image") {
          await preloadImage(asset.url);
        } else {
          await preloadVideo(asset.url);
        }
        updateAssetState(asset.url, true, false);
      } catch (error) {
        console.warn(`Failed to preload asset: ${asset.url}`, error);
        updateAssetState(asset.url, false, true);
      }
    },
    [preloadImage, preloadVideo, updateAssetState],
  );

  const addResourceHints = useCallback(() => {
    const criticalAssets = [
      { url: backgroundImage, as: "image", type: "image/webp" },
    ];

    criticalAssets.forEach(({ url, as, type }) => {
      if (document.querySelector(`link[href="${url}"]`)) return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = as;
      link.type = type;

      document.head.appendChild(link);
    });
  }, []);

  const startPreloading = useCallback(async () => {
    const assetsList = generateAssetsList();

    addResourceHints();

    setState({
      assets: assetsList,
      totalAssets: assetsList.length,
      loadedAssets: 0,
      failedAssets: 0,
      isComplete: false,
      progress: 0,
    });

    const criticalAssets = assetsList.filter(
      (asset) =>
        asset.url.includes("intro.mp4") || asset.url === backgroundImage,
    );
    const nonCriticalAssets = assetsList.filter(
      (asset) => !criticalAssets.includes(asset),
    );

    const criticalPromises = criticalAssets.map((asset) => preloadAsset(asset));
    await Promise.allSettled(criticalPromises);

    const batchSize = 6;
    for (let i = 0; i < nonCriticalAssets.length; i += batchSize) {
      const batch = nonCriticalAssets.slice(i, i + batchSize);
      const batchPromises = batch.map((asset) => preloadAsset(asset));
      await Promise.allSettled(batchPromises);
    }
  }, [generateAssetsList, preloadAsset, addResourceHints]);

  useEffect(() => {
    startPreloading();
  }, [startPreloading]);

  return {
    ...state,
    startPreloading,
  };
};
