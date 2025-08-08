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

      // Set src last to trigger loading
      img.src = url;

      // Add timeout for stuck images
      setTimeout(() => {
        if (!img.complete) {
          console.warn(`Image preload timeout for: ${url}`);
          cleanup();
          resolve(); // Resolve to not block the app
        }
      }, 10000); // 10 second timeout
    });
  }, []);

  const preloadVideo = useCallback((url: string): Promise<void> => {
    return new Promise((resolve) => {
      // First check if video exists with a HEAD request to avoid content-type issues
      fetch(url, { method: "HEAD" })
        .then((response) => {
          if (!response.ok) {
            console.warn(`Video not found: ${url} (${response.status})`);
            resolve(); // Don't block the app for missing videos
            return;
          }

          const video = document.createElement("video");
          let resolved = false;

          // Fallback timeout for Safari (5 seconds)
          const timeoutId = setTimeout(() => {
            if (!resolved) {
              console.warn(`Video preload timeout for: ${url}`);
              resolved = true;
              cleanup();
              resolve(); // Resolve instead of reject to not block the app
            }
          }, 5000);

          const handleSuccess = () => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve();
            }
          };

          const handleError = (error: Event) => {
            if (!resolved) {
              resolved = true;
              cleanup();
              console.warn(`Video preload failed: ${url}`, error);
              resolve(); // Don't block the app
            }
          };

          const cleanup = () => {
            video.removeEventListener("loadedmetadata", handleSuccess);
            video.removeEventListener("canplay", handleSuccess);
            video.removeEventListener("error", handleError);
            clearTimeout(timeoutId);
          };

          // Safari-friendly event listeners
          video.addEventListener("loadedmetadata", handleSuccess);
          video.addEventListener("canplay", handleSuccess);
          video.addEventListener("error", handleError);

          video.preload = "metadata";
          video.muted = true; // Safari requires muted for autoplay
          video.src = url;
        })
        .catch((error) => {
          console.warn(`Failed to check video existence: ${url}`, error);
          resolve(); // Don't block the app for network errors
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
        // Asset preloaded successfully
      } catch (error) {
        console.warn(`Failed to preload asset: ${asset.url}`, error);
        updateAssetState(asset.url, false, true);
      }
    },
    [preloadImage, preloadVideo, updateAssetState],
  );

  // Add resource hints to document head for critical assets
  const addResourceHints = useCallback(() => {
    const criticalAssets = [
      { url: `/videos/intro.mp4`, as: "video", type: "video/mp4" },
      { url: backgroundImage, as: "image", type: "image/webp" },
    ];

    criticalAssets.forEach(({ url, as, type }) => {
      // Check if hint already exists
      if (document.querySelector(`link[href="${url}"]`)) return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = as;
      link.type = type;

      // Add crossorigin for video files to prevent CORS issues
      if (as === "video") {
        link.crossOrigin = "anonymous";
      }

      document.head.appendChild(link);
    });
  }, []);

  const startPreloading = useCallback(async () => {
    const assetsList = generateAssetsList();

    // Add resource hints for critical assets
    addResourceHints();

    setState({
      assets: assetsList,
      totalAssets: assetsList.length,
      loadedAssets: 0,
      failedAssets: 0,
      isComplete: false,
      progress: 0,
    });

    // Prioritize critical assets by loading them first
    const criticalAssets = assetsList.filter(
      (asset) =>
        asset.url.includes("intro.mp4") || asset.url === backgroundImage,
    );
    const nonCriticalAssets = assetsList.filter(
      (asset) => !criticalAssets.includes(asset),
    );

    // Load critical assets first, then non-critical ones in parallel
    const criticalPromises = criticalAssets.map((asset) => preloadAsset(asset));
    await Promise.allSettled(criticalPromises);

    // Load remaining assets in batches to avoid overwhelming the browser
    const batchSize = 6; // Reasonable concurrent requests
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
