import { useCallback, useState, useRef } from "react";
import { isMobile } from "../utils/mobileDetection";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import backgroundImage from "../assets/images/background.webp";
import backgroundMobileImage from "../assets/images/background_mobile.png";
import logoRendered from "../assets/images/logo_rendered.png";
import p1 from "../assets/images/card_backgrounds/1.webp";
import p2 from "../assets/images/card_backgrounds/2.webp";
import p3 from "../assets/images/card_backgrounds/3.webp";

const debugLog = (_message?: string, _data?: unknown) => {
  return;
};

// Global cache for preloaded models
const modelCache = new Map<string, unknown>();

const debugError = (_message?: string, _error?: unknown) => {
  return;
};

const debugSuccess = (_message?: string, _data?: unknown) => {
  return;
};

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
    debugLog("🚀 Starting CRITICAL asset list generation (Phase 1 refactor)");

    const isMobileDevice = isMobile();

    debugLog("Environment info:", {
      userAgent: navigator.userAgent,
      isMobile: isMobileDevice,
      cookiesEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    });

    const assets: AssetLoadState[] = [];

    debugLog(
      `Adding ${isMobileDevice ? "mobile" : "desktop"} entry and loop videos`,
    );

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
        url: `/videos/intro/desktop/entry_desktop.mp4`,
        loaded: false,
        error: false,
        type: "video",
      });
      assets.push({
        url: `/videos/intro/desktop/loop_desktop.mp4`,
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

    debugLog(`Generated ${assets.length} CRITICAL assets for preloading:`, {
      videos: assets.filter((a) => a.type === "video").length,
      images: assets.filter((a) => a.type === "image").length,
      models: assets.filter((a) => a.type === "model").length,
      assetsList: assets.map((a) => ({ url: a.url, type: a.type })),
    });

    return assets;
  }, []);

  const preloadImage = useCallback((url: string): Promise<void> => {
    const startTime = Date.now();
    debugLog(`🖼️ Starting image preload: ${url}`);

    return new Promise((resolve, reject) => {
      const img = new Image();

      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent,
      );
      const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

      debugLog(`Image load config for ${url}:`, {
        isSafari,
        isFirefox,
        decoding: "async",
        loading: "eager",
      });

      img.decoding = "async";
      img.loading = "eager";

      // Set crossOrigin for all images to match preload link behavior
      img.crossOrigin = "anonymous";
      debugLog(`Set crossOrigin=anonymous for ${url}`);

      const handleLoad = () => {
        const duration = Date.now() - startTime;
        debugSuccess(`Image loaded successfully: ${url} (${duration}ms)`, {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
        });
        cleanup();
        resolve();
      };

      const handleError = (event: Event) => {
        const duration = Date.now() - startTime;
        debugError(`Image failed to load: ${url} (${duration}ms)`, {
          event,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
        cleanup();
        reject(new Error(`Failed to load image: ${url}`));
      };

      const cleanup = () => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleError);
      };

      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);

      debugLog(`Setting image src: ${url}`);
      img.src = url;

      setTimeout(() => {
        if (!img.complete) {
          const duration = Date.now() - startTime;
          debugError(
            `Image preload timeout (10s) for: ${url} (${duration}ms)`,
            {
              complete: img.complete,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
            },
          );
          cleanup();
          resolve();
        }
      }, 10000);
    });
  }, []);

  const preloadVideo = useCallback((url: string): Promise<void> => {
    const startTime = Date.now();
    debugLog(`🎥 Starting video preload: ${url}`);

    // Check if this is an intro video (should load without timeout)
    const isIntroVideo = url.includes('/videos/intro/');
    debugLog(`Video ${url} is intro video: ${isIntroVideo}`);

    return new Promise((resolve) => {
      debugLog(`Fetching video HEAD request: ${url}`);

      const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
      if (isFirefox) {
        debugLog(`Firefox detected - using direct video preload for: ${url}`);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;

        const handleVideoReady = () => {
          const duration = Date.now() - startTime;
          debugSuccess(
            `Firefox direct video preload success: ${url} (${duration}ms)`,
          );
          resolve();
        };

        const handleVideoError = () => {
          debugError(
            `Firefox direct video preload failed: ${url}, fallback to fetch`,
          );
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
            const headDuration = Date.now() - startTime;
            const contentType = response.headers.get("content-type");

            debugLog(`Video HEAD response for ${url} (${headDuration}ms):`, {
              ok: response.ok,
              status: response.status,
              statusText: response.statusText,
              contentType,
              headers: Object.fromEntries(response.headers.entries()),
            });

            if (!response.ok || !contentType?.includes("video")) {
              debugError(`Video HEAD check failed for ${url}:`, {
                ok: response.ok,
                status: response.status,
                contentType,
                reason: !response.ok
                  ? "Response not ok"
                  : "Content-type not video",
              });
              resolve();
              return;
            }

            debugSuccess(
              `Video HEAD check passed for ${url}, starting video element preload`,
            );

            const videoStartTime = Date.now();

            const video = document.createElement("video");
            let resolved = false;

            const handleSuccess = () => {
              if (!resolved) {
                resolved = true;
                const duration = Date.now() - videoStartTime;
                debugSuccess(`Video preload success: ${url} (${duration}ms)`, {
                  duration: video.duration,
                  readyState: video.readyState,
                  videoWidth: video.videoWidth,
                  videoHeight: video.videoHeight,
                  networkState: video.networkState,
                });
                cleanup();
                resolve();
              }
            };

            const handleError = (event: Event) => {
              if (!resolved) {
                resolved = true;
                const duration = Date.now() - videoStartTime;
                debugError(`Video preload error: ${url} (${duration}ms)`, {
                  event,
                  error: video.error,
                  readyState: video.readyState,
                  networkState: video.networkState,
                });
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
            const timeoutId = !isIntroVideo ? setTimeout(() => {
              if (!resolved) {
                resolved = true;
                const duration = Date.now() - videoStartTime;
                debugError(
                  `Video preload timeout (15s): ${url} (${duration}ms)`,
                  {
                    readyState: video.readyState,
                    networkState: video.networkState,
                    duration: video.duration,
                  },
                );
                cleanup();
                resolve(); // Don't fail on timeout, just continue
              }
            }, 15000) : null;

            video.addEventListener("loadedmetadata", handleSuccess);
            video.addEventListener("error", handleError);

            video.muted = true;

            debugLog(`Setting video src: ${url}`, {
              preload: video.preload,
              muted: video.muted,
            });

            video.src = url;
          })
          .catch((error) => {
            const fetchDuration = Date.now() - startTime;
            debugError(`Video fetch error for ${url} (${fetchDuration}ms):`, {
              error,
              name: error.name,
              message: error.message,
              stack: error.stack,
            });
            resolve();
          });
      }
    });
  }, []);

  const preloadModel = useCallback((url: string): Promise<void> => {
    const startTime = Date.now();
    debugLog(`🎭 Starting 3D model preload: ${url}`);

    return new Promise((resolve, reject) => {
      // Check if model is already cached
      if (modelCache.has(url)) {
        const duration = Date.now() - startTime;
        debugSuccess(`3D model loaded from cache: ${url} (${duration}ms)`);
        resolve();
        return;
      }

      const loader = new GLTFLoader();

      loader.load(
        url,
        (gltf) => {
          const duration = Date.now() - startTime;
          // Cache the loaded model
          modelCache.set(url, gltf);
          debugSuccess(`3D model loaded successfully: ${url} (${duration}ms)`, {
            scene: gltf.scene,
            animations: gltf.animations?.length || 0,
            materials:
              (gltf as unknown as { materials?: unknown[] }).materials
                ?.length || 0,
          });
          resolve();
        },
        (progress) => {
          if (progress.lengthComputable) {
            const percent = Math.round(
              (progress.loaded / progress.total) * 100,
            );
            debugLog(`3D model loading progress: ${url} - ${percent}%`);
          }
        },
        (error) => {
          const duration = Date.now() - startTime;
          debugError(`3D model failed to load: ${url} (${duration}ms)`, error);
          reject(new Error(`Failed to load 3D model: ${url}`));
        },
      );

      // Timeout after 30 seconds for 3D models
      setTimeout(() => {
        const duration = Date.now() - startTime;
        debugError(`3D model preload timeout (30s): ${url} (${duration}ms)`);
        resolve(); // Don't fail on timeout, just continue
      }, 30000);
    });
  }, []);

  const updateAssetState = useCallback(
    (url: string, loaded: boolean, error: boolean) => {
      debugLog(`📊 Asset state update: ${url}`, { loaded, error });

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

        debugLog(`Progress update: ${Math.round(progress * 100)}%`, {
          loaded: loadedCount,
          failed: failedCount,
          total: updatedAssets.length,
          isComplete,
        });

        if (isComplete) {
          debugSuccess(`🎉 All assets preloaded! Summary:`, {
            totalAssets: updatedAssets.length,
            successful: loadedCount,
            failed: failedCount,
            failedAssets: updatedAssets
              .filter((a) => a.error)
              .map((a) => a.url),
          });
        }

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
      const assetStartTime = Date.now();
      debugLog(`⚡ Starting asset preload: ${asset.type} - ${asset.url}`);

      try {
        if (asset.type === "image") {
          await preloadImage(asset.url);
        } else if (asset.type === "video") {
          await preloadVideo(asset.url);
        } else if (asset.type === "model") {
          await preloadModel(asset.url);
        }
        const duration = Date.now() - assetStartTime;
        debugSuccess(
          `Asset preloaded successfully: ${asset.url} (${duration}ms)`,
        );
        updateAssetState(asset.url, true, false);
      } catch (error) {
        const duration = Date.now() - assetStartTime;
        debugError(`Asset preload failed: ${asset.url} (${duration}ms)`, error);
        updateAssetState(asset.url, false, true);
      }
    },
    [preloadImage, preloadVideo, preloadModel, updateAssetState],
  );

  const addResourceHints = useCallback(() => {
    const isMobileDevice = isMobile();
    const currentBackgroundImage = isMobileDevice ? backgroundMobileImage : backgroundImage;
    const currentBackgroundType = isMobileDevice ? "image/png" : "image/webp";

    // Preload both desktop and mobile backgrounds for device switching scenarios
    const criticalAssets = [
      { url: currentBackgroundImage, as: "image", type: currentBackgroundType },
      // Also preload the alternate device background for faster switching
      {
        url: isMobileDevice ? backgroundImage : backgroundMobileImage,
        as: "image",
        type: isMobileDevice ? "image/webp" : "image/png"
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
      debugLog("Preloading already started, skipping");
      return;
    }
    hasStarted.current = true;

    const preloadStartTime = Date.now();
    debugLog(
      "🚀🚀🚀 STARTING CRITICAL PRELOADING PROCESS (Phase 1 refactor) 🚀🚀🚀",
    );

    const assetsList = generateAssetsList();

    debugLog("Adding resource hints");
    addResourceHints();

    debugLog("Setting initial state");
    setState({
      assets: assetsList,
      totalAssets: assetsList.length,
      loadedAssets: 0,
      failedAssets: 0,
      isComplete: false,
      progress: 0,
    });

    debugLog(
      `🔥 Starting ALL critical assets (${assetsList.length}):`,
      assetsList.map((a) => a.url),
    );

    // Load all critical assets in parallel - no need for batching with only 5 assets
    const allPromises = assetsList.map((asset) => preloadAsset(asset));
    const results = await Promise.allSettled(allPromises);

    const totalDuration = Date.now() - preloadStartTime;
    debugSuccess(
      `🏁 CRITICAL PRELOADING COMPLETED (${totalDuration}ms total):`,
      {
        results: results.map((result, index) => ({
          url: assetsList[index].url,
          status: result.status,
          ...(result.status === "rejected" && { reason: result.reason }),
        })),
      },
    );
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
