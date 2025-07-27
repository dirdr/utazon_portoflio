import { useCallback, useEffect, useState } from "react";
import { allProjectsSortedByPriority } from "../data/projects";

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
      url: `/videos/intro.webm`,
      loaded: false,
      error: false,
      type: "video",
    });

    assets.push({
      url: `../assets/images/background.webp`,
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
        url: `/videos/projects/${project.id}/thumbnail.webm`,
        loaded: false,
        error: false,
        type: "video",
      });
    });

    return assets;
  }, []);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }, []);

  const preloadVideo = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.oncanplaythrough = () => resolve();
      video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
      video.preload = "metadata";
      video.src = url;
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
        console.log("Preloaded Assets");
      } catch (error) {
        console.warn(`Failed to preload asset: ${asset.url}`, error);
        updateAssetState(asset.url, false, true);
      }
    },
    [preloadImage, preloadVideo, updateAssetState],
  );

  const startPreloading = useCallback(async () => {
    const assetsList = generateAssetsList();

    setState({
      assets: assetsList,
      totalAssets: assetsList.length,
      loadedAssets: 0,
      failedAssets: 0,
      isComplete: false,
      progress: 0,
    });

    const preloadPromises = assetsList.map((asset) => preloadAsset(asset));

    await Promise.allSettled(preloadPromises);
  }, [generateAssetsList, preloadAsset]);

  useEffect(() => {
    startPreloading();
  }, [startPreloading]);

  return {
    ...state,
    startPreloading,
  };
};

