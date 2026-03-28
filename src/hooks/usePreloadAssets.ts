import { useCallback, useState, useRef } from "react";
import { isMobile } from "../utils/mobileDetection";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import backgroundImage from "../assets/images/background.webp";
import backgroundMobileImage from "../assets/images/background_mobile.png";
import logoRendered from "../assets/images/logo_rendered.png";
import p1 from "../assets/images/card_backgrounds/1.webp";
import p2 from "../assets/images/card_backgrounds/2.webp";
import p3 from "../assets/images/card_backgrounds/3.webp";

const modelCache = new Map<string, unknown>();

export interface AssetLoadState {
  url: string;
  loaded: boolean;
  error: boolean;
  type: "image" | "video" | "model";
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
  const hasStarted = useRef(false);

  const generateAssetsList = useCallback((): AssetLoadState[] => {
    const isMobileDevice = isMobile();
    const assets: AssetLoadState[] = [];

    if (isMobileDevice) {
      assets.push({
        url: `/videos/intro/mobile/entry_mobile.mp4`,
        loaded: false,
        error: false,
        type: "video",
      });
      assets.push({
        url: `/videos/intro/mobile/loop_mobile.mp4`,
        loaded: false,
        error: false,
        type: "video",
      });
      // Add mobile logo for About page
      assets.push({
        url: logoRendered,
        loaded: false,
        error: false,
        type: "image",
      });
    } else {
      assets.push({
        url: `/videos/intro/desktop/entry_desktop_4K.mp4`,
        loaded: false,
        error: false,
        type: "video",
      });
      assets.push({
        url: `/videos/intro/desktop/loop_desktop_4K.mp4`,
        loaded: false,
        error: false,
        type: "video",
      });
    }

    // Add both desktop and mobile background images for proper cache coordination
    assets.push({
      url: backgroundImage,
      loaded: false,
      error: false,
      type: "image",
    });

    assets.push({
      url: backgroundMobileImage,
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

    // Add 3D model for About page
    assets.push({
      url: "/models/logo4.glb",
      loaded: false,
      error: false,
      type: "model",
    });

    return assets;
  }, []);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.decoding = "async";
      img.loading = "eager";

      // Set crossOrigin for all images to match preload link behavior
      img.crossOrigin = "anonymous";

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
          cleanup();
          resolve();
        }
      }, 10000);
    });
  }, []);

  const preloadVideo = useCallback((url: string): Promise<void> => {
    // Check if this is an intro video (should load without timeout)
    const isIntroVideo = url.includes("/videos/intro/");

    return new Promise((resolve) => {
      const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
      if (isFirefox) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;

        const handleVideoReady = () => {
          resolve();
        };

        const handleVideoError = () => {
          performFetch();
        };

        video.addEventListener("loadedmetadata", handleVideoReady, {
          once: true,
        });
        video.addEventListener("error", handleVideoError, { once: true });
        video.src = url;

        // Only set timeout for non-intro videos
        if (!isIntroVideo) {
          setTimeout(() => {
            handleVideoReady();
          }, 15000);
        }

        return;
      }

      performFetch();

      function performFetch() {
        fetch(url, {
          method: "HEAD",
          mode: "cors",
          cache: "no-cache",
        })
          .then((response) => {
            const contentType = response.headers.get("content-type");

            if (!response.ok || !contentType?.includes("video")) {
              resolve();
              return;
            }

            const video = document.createElement("video");
            let resolved = false;

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
              video.removeEventListener("error", handleError);
              if (timeoutId) clearTimeout(timeoutId);
              video.src = "";
              video.remove?.();
            };

            // Add timeout for video preloading (skip for intro videos)
            const timeoutId = !isIntroVideo
              ? setTimeout(() => {
                  if (!resolved) {
                    resolved = true;
                    cleanup();
                    resolve(); // Don't fail on timeout, just continue
                  }
                }, 15000)
              : null;

            video.addEventListener("loadedmetadata", handleSuccess);
            video.addEventListener("error", handleError);

            video.muted = true;
            video.src = url;
          })
          .catch(() => {
            resolve();
          });
      }
    });
  }, []);

  const preloadModel = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if model is already cached
      if (modelCache.has(url)) {
        resolve();
        return;
      }

      const loader = new GLTFLoader();

      loader.load(
        url,
        (gltf) => {
          // Cache the loaded model
          modelCache.set(url, gltf);
          resolve();
        },
        undefined,
        () => {
          reject(new Error(`Failed to load 3D model: ${url}`));
        },
      );

      // Timeout after 30 seconds for 3D models
      setTimeout(() => {
        resolve(); // Don't fail on timeout, just continue
      }, 30000);
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
        } else if (asset.type === "video") {
          await preloadVideo(asset.url);
        } else if (asset.type === "model") {
          await preloadModel(asset.url);
        }
        updateAssetState(asset.url, true, false);
      } catch {
        updateAssetState(asset.url, false, true);
      }
    },
    [preloadImage, preloadVideo, preloadModel, updateAssetState],
  );

  const addResourceHints = useCallback(() => {
    const isMobileDevice = isMobile();
    const currentBackgroundImage = isMobileDevice
      ? backgroundMobileImage
      : backgroundImage;
    const currentBackgroundType = isMobileDevice ? "image/png" : "image/webp";

    // Preload both desktop and mobile backgrounds for device switching scenarios
    const criticalAssets = [
      { url: currentBackgroundImage, as: "image", type: currentBackgroundType },
      // Also preload the alternate device background for faster switching
      {
        url: isMobileDevice ? backgroundImage : backgroundMobileImage,
        as: "image",
        type: isMobileDevice ? "image/webp" : "image/png",
      },
    ];

    criticalAssets.forEach(({ url, as, type }) => {
      if (document.querySelector(`link[href="${url}"]`)) return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = as;
      link.type = type;
      link.crossOrigin = "anonymous"; // Match image crossOrigin setting

      document.head.appendChild(link);
    });
  }, []);

  const startPreloading = useCallback(async () => {
    // Prevent multiple starts using ref
    if (hasStarted.current) {
      return;
    }
    hasStarted.current = true;

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

    // Load all critical assets in parallel - no need for batching with only 5 assets
    const allPromises = assetsList.map((asset) => preloadAsset(asset));
    await Promise.allSettled(allPromises);
  }, [generateAssetsList, preloadAsset, addResourceHints]);

  return {
    ...state,
    startPreloading,
  };
};

// Export model cache for use in components
export const getPreloadedModel = (url: string) => {
  return modelCache.get(url);
};

export const isModelPreloaded = (url: string) => {
  return modelCache.has(url);
};

// Export logo asset for components
export { logoRendered };
