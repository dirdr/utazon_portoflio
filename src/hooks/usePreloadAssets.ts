import { useCallback, useEffect, useState } from "react";
import { allProjectsSortedByPriority } from "../data/projects";
import backgroundImage from "../assets/images/background.webp";
import p1 from "../assets/images/card_backgrounds/1.webp";
import p2 from "../assets/images/card_backgrounds/2.webp";
import p3 from "../assets/images/card_backgrounds/3.webp";

// Debug utility for preloader
const DEBUG_PRELOADER = true; // Set to false in production
const debugLog = (message: string, data?: unknown) => {
  if (DEBUG_PRELOADER) {
    const timestamp = new Date().toISOString().slice(11, 23);
    console.log(`🔄 [PRELOADER ${timestamp}] ${message}`, data || '');
  }
};

// Mobile detection utility
const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const debugError = (message: string, error?: unknown) => {
  if (DEBUG_PRELOADER) {
    const timestamp = new Date().toISOString().slice(11, 23);
    console.error(`❌ [PRELOADER ${timestamp}] ${message}`, error || '');
  }
};

const debugSuccess = (message: string, data?: unknown) => {
  if (DEBUG_PRELOADER) {
    const timestamp = new Date().toISOString().slice(11, 23);
    console.log(`✅ [PRELOADER ${timestamp}] ${message}`, data || '');
  }
};

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
    debugLog('🚀 Starting asset list generation');
    
    // Environment detection for debugging
    const userAgent = navigator.userAgent;
    const isPrivateBrowsing = (() => {
      try {
        return 'webkitTemporaryStorage' in navigator && 
          !(navigator as Navigator & { webkitTemporaryStorage?: { queryUsageAndQuota?: unknown } })
            .webkitTemporaryStorage?.queryUsageAndQuota;
      } catch {
        return false;
      }
    })();
    const isMobileDevice = isMobile();
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isFirefox = userAgent.toLowerCase().includes("firefox");
    const isChrome = userAgent.toLowerCase().includes("chrome");
    
    // Check network conditions for mobile optimization
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const isSlowNetwork = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g' || 
                         (connection?.downlink && connection.downlink < 1.5);
    const isMobileOrSlow = isMobileDevice || isSlowNetwork || isPrivateBrowsing;
    
    debugLog('Environment info:', {
      userAgent,
      isPrivateBrowsing,
      isMobile: isMobileDevice,
      isSafari,
      isFirefox,
      isChrome,
      isSlowNetwork,
      isMobileOrSlow,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      cookiesEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      storage: {
        localStorage: typeof(Storage) !== "undefined" && localStorage,
        sessionStorage: typeof(Storage) !== "undefined" && sessionStorage,
      }
    });

    const assets: AssetLoadState[] = [];

    // Mobile-optimized video loading - only load appropriate intro video
    debugLog(`Adding ${isMobileDevice ? 'mobile' : 'desktop'} intro video`);
    if (isMobileDevice) {
      // Mobile: Only load the lighter mobile intro video (12MB vs 25MB)
      assets.push({
        url: `/videos/intro_mobile.mp4`,
        loaded: false,
        error: false,
        type: "video",
      });
    } else {
      // Desktop: Only load the desktop intro video (25MB)
      assets.push({
        url: `/videos/intro.mp4`,
        loaded: false,
        error: false,
        type: "video",
      });
    }

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

    // Mobile vs Desktop asset loading strategy
    if (isMobileOrSlow) {
      debugLog('📱 Mobile/Slow network detected - loading only critical project assets');
      
      // Only load top 6 priority projects for mobile/slow networks
      const criticalProjects = allProjectsSortedByPriority.slice(0, 6);
      
      criticalProjects.forEach((project) => {
        // Only cover images for mobile - skip backgrounds and videos initially
        assets.push({
          url: `/images/projects/${project.id}/cover.webp`,
          loaded: false,
          error: false,
          type: "image",
        });
        
        // Skip video thumbnails for mobile to reduce initial load
        // Skip DALS carousel videos completely for mobile
      });
      
      debugLog(`Mobile: Loading only ${criticalProjects.length} critical projects (covers only)`);
      
    } else {
      debugLog('🖥️ Desktop detected - loading all project assets');
      
      // Full loading for desktop
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

        // Add DALS project carousel videos to preloading (desktop only)
        if (project.id === "dals" && project.showcases) {
          project.showcases.forEach((showcase) => {
            if (showcase.type === "video-carousel" && showcase.videos) {
              showcase.videos.forEach((video) => {
                assets.push({
                  url: video.src,
                  loaded: false,
                  error: false,
                  type: "video",
                });
              });
            }
            if (showcase.type === "video-grid" && showcase.videos) {
              showcase.videos.forEach((video) => {
                assets.push({
                  url: video.src,
                  loaded: false,
                  error: false,
                  type: "video",
                });
              });
            }
          });
        }
      });
    }

    debugLog(`Generated ${assets.length} assets for preloading:`, {
      videos: assets.filter(a => a.type === 'video').length,
      images: assets.filter(a => a.type === 'image').length,
      assetsList: assets.map(a => ({ url: a.url, type: a.type }))
    });

    return assets;
  }, []);

  const preloadImage = useCallback((url: string): Promise<void> => {
    const startTime = Date.now();
    debugLog(`🖼️ Starting image preload: ${url}`);
    
    return new Promise((resolve, reject) => {
      const img = new Image();

      // Safari/Firefox specific optimizations
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent,
      );
      const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

      debugLog(`Image load config for ${url}:`, {
        isSafari,
        isFirefox,
        decoding: "async",
        loading: "eager"
      });

      img.decoding = "async";
      img.loading = "eager";

      // Help Safari/Firefox with WebP loading - only if served with CORS headers
      if ((isSafari || isFirefox) && !url.includes('/videos/')) {
        img.crossOrigin = "anonymous";
        debugLog(`Set crossOrigin=anonymous for ${url} (Safari/Firefox)`);
      }

      const handleLoad = () => {
        const duration = Date.now() - startTime;
        debugSuccess(`Image loaded successfully: ${url} (${duration}ms)`, {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete
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
          naturalHeight: img.naturalHeight
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

      // Timeout fallback
      setTimeout(() => {
        if (!img.complete) {
          const duration = Date.now() - startTime;
          debugError(`Image preload timeout (10s) for: ${url} (${duration}ms)`, {
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          });
          cleanup();
          resolve(); // Don't fail on timeout, just continue
        }
      }, 10000);
    });
  }, []);

  const preloadVideo = useCallback((url: string): Promise<void> => {
    const startTime = Date.now();
    debugLog(`🎥 Starting video preload: ${url}`);
    
    return new Promise((resolve) => {
      debugLog(`Fetching video HEAD request: ${url}`);
      
      // For Firefox, try direct video element creation first to avoid CORS issues
      const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
      if (isFirefox) {
        debugLog(`Firefox detected - using direct video preload for: ${url}`);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;
        
        const handleVideoReady = () => {
          const duration = Date.now() - startTime;
          debugSuccess(`Firefox direct video preload success: ${url} (${duration}ms)`);
          resolve();
        };
        
        const handleVideoError = () => {
          debugError(`Firefox direct video preload failed: ${url}, fallback to fetch`);
          // Fallback to original fetch method
          performFetch();
        };
        
        video.addEventListener("loadedmetadata", handleVideoReady, { once: true });
        video.addEventListener("error", handleVideoError, { once: true });
        video.src = url;
        
        // Timeout fallback
        setTimeout(() => {
          handleVideoReady();
        }, 5000);
        
        return;
      }
      
      // Standard fetch for other browsers
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
              headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok || !contentType?.includes("video")) {
              debugError(`Video HEAD check failed for ${url}:`, {
                ok: response.ok,
                status: response.status,
                contentType,
                reason: !response.ok ? 'Response not ok' : 'Content-type not video'
              });
              resolve();
              return;
            }

            debugSuccess(`Video HEAD check passed for ${url}, starting video element preload`);
            
            const videoStartTime = Date.now();

            const video = document.createElement("video");
            let resolved = false;

            // Longer timeout for critical videos that need full preload
            const isCriticalVideo =
              url.includes("intro.mp4") || url.includes("intro_mobile.mp4");
            const isSafari = /^((?!chrome|android).)*safari/i.test(
              navigator.userAgent,
            );
            const timeoutDuration = isCriticalVideo
              ? 10000
              : isSafari
                ? 8000
                : 3000; // Safari needs more time for .webm

            debugLog(`Video preload setup for ${url}:`, {
              isCriticalVideo,
              isSafari,
              timeoutDuration,
              preloadType: isCriticalVideo ? "auto" : "metadata",
              eventType: isCriticalVideo ? "canplaythrough" : "loadedmetadata"
            });

            const timeoutId = setTimeout(() => {
              if (!resolved) {
                resolved = true;
                const duration = Date.now() - videoStartTime;
                debugError(`Video preload timeout: ${url} (${duration}ms)`, {
                  timeoutDuration,
                  readyState: video.readyState,
                  networkState: video.networkState,
                  duration: video.duration
                });
                cleanup();
                resolve();
              }
            }, timeoutDuration);

            const handleSuccess = () => {
              if (!resolved) {
                resolved = true;
                const duration = Date.now() - videoStartTime;
                debugSuccess(`Video preload success: ${url} (${duration}ms)`, {
                  duration: video.duration,
                  readyState: video.readyState,
                  videoWidth: video.videoWidth,
                  videoHeight: video.videoHeight,
                  networkState: video.networkState
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
                  networkState: video.networkState
                });
                cleanup();
                resolve();
              }
            };

            const cleanup = () => {
              if (isCriticalVideo) {
                video.removeEventListener("canplaythrough", handleSuccess);
              } else {
                video.removeEventListener("loadedmetadata", handleSuccess);
              }
              video.removeEventListener("error", handleError);
              video.src = "";
              video.remove?.();
              clearTimeout(timeoutId);
            };

            if (isCriticalVideo) {
              video.addEventListener("canplaythrough", handleSuccess);
            } else {
              video.addEventListener("loadedmetadata", handleSuccess);
            }
            video.addEventListener("error", handleError);

            video.preload = isCriticalVideo ? "auto" : "metadata";
            video.muted = true;
            
            debugLog(`Setting video src: ${url}`, {
              preload: video.preload,
              muted: video.muted
            });
            
            video.src = url;
          })
          .catch((error) => {
            const fetchDuration = Date.now() - startTime;
            debugError(`Video fetch error for ${url} (${fetchDuration}ms):`, {
              error,
              name: error.name,
              message: error.message,
              stack: error.stack
            });
            resolve();
          });
      }
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
          isComplete
        });

        if (isComplete) {
          debugSuccess(`🎉 All assets preloaded! Summary:`, {
            totalAssets: updatedAssets.length,
            successful: loadedCount,
            failed: failedCount,
            failedAssets: updatedAssets.filter(a => a.error).map(a => a.url)
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
        } else {
          await preloadVideo(asset.url);
        }
        const duration = Date.now() - assetStartTime;
        debugSuccess(`Asset preloaded successfully: ${asset.url} (${duration}ms)`);
        updateAssetState(asset.url, true, false);
      } catch (error) {
        const duration = Date.now() - assetStartTime;
        debugError(`Asset preload failed: ${asset.url} (${duration}ms)`, error);
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

  // Lazy loading function for non-critical mobile assets
  const startLazyLoading = useCallback(async () => {
    if (!isMobile()) return;

    debugLog('🔄 Starting lazy loading of non-critical mobile assets');
    
    // Load remaining project assets after initial load
    const additionalAssets: AssetLoadState[] = [];
    const remainingProjects = allProjectsSortedByPriority.slice(6); // Projects 7+
    
    remainingProjects.forEach((project) => {
      additionalAssets.push({
        url: `/images/projects/${project.id}/cover.webp`,
        loaded: false,
        error: false,
        type: "image",
      });
    });
    
    // Load backgrounds for first 6 projects
    const topProjects = allProjectsSortedByPriority.slice(0, 6);
    topProjects.forEach((project) => {
      additionalAssets.push({
        url: `/images/projects/${project.id}/background.webp`,
        loaded: false,
        error: false,
        type: "image",
      });
    });

    debugLog(`Lazy loading ${additionalAssets.length} additional mobile assets`);
    
    // Load in small batches to avoid overwhelming mobile networks
    const batchSize = 2;
    for (let i = 0; i < additionalAssets.length; i += batchSize) {
      const batch = additionalAssets.slice(i, i + batchSize);
      await Promise.allSettled(batch.map(asset => preloadAsset(asset)));
      
      // Small delay between batches for mobile
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }, [preloadAsset]);

  const startPreloading = useCallback(async () => {
    const preloadStartTime = Date.now();
    debugLog('🚀🚀🚀 STARTING PRELOADING PROCESS 🚀🚀🚀');
    
    const assetsList = generateAssetsList();

    debugLog('Adding resource hints');
    addResourceHints();

    debugLog('Setting initial state');
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
        asset.url.includes("intro.mp4") || asset.url.includes("intro_mobile.mp4") || asset.url === backgroundImage,
    );
    const nonCriticalAssets = assetsList.filter(
      (asset) => !criticalAssets.includes(asset),
    );

    debugLog(`🔥 Starting critical assets (${criticalAssets.length}):`, criticalAssets.map(a => a.url));
    const criticalStartTime = Date.now();
    const criticalPromises = criticalAssets.map((asset) => preloadAsset(asset));
    const criticalResults = await Promise.allSettled(criticalPromises);
    const criticalDuration = Date.now() - criticalStartTime;
    
    debugSuccess(`Critical assets completed (${criticalDuration}ms):`, {
      results: criticalResults.map((result, index) => ({
        url: criticalAssets[index].url,
        status: result.status,
        ...(result.status === 'rejected' && { reason: result.reason })
      }))
    });

    // Optimize batch size based on environment
    const isPrivateBrowsing = (() => {
      try {
        return 'webkitTemporaryStorage' in navigator && 
          !(navigator as Navigator & { webkitTemporaryStorage?: { queryUsageAndQuota?: unknown } })
            .webkitTemporaryStorage?.queryUsageAndQuota;
      } catch {
        return false;
      }
    })();
    
    const batchSize = isPrivateBrowsing || isMobile() ? 4 : 8; // Smaller batches for constrained environments
    debugLog(`📦 Starting batched preloading of ${nonCriticalAssets.length} non-critical assets (batch size: ${batchSize}, private: ${isPrivateBrowsing}, mobile: ${isMobile()})`);
    
    for (let i = 0; i < nonCriticalAssets.length; i += batchSize) {
      const batch = nonCriticalAssets.slice(i, i + batchSize);
      const batchStartTime = Date.now();
      
      debugLog(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(nonCriticalAssets.length/batchSize)}:`, 
        batch.map(a => a.url));
      
      const batchPromises = batch.map((asset) => preloadAsset(asset));
      const batchResults = await Promise.allSettled(batchPromises);
      const batchDuration = Date.now() - batchStartTime;
      
      debugLog(`Batch ${Math.floor(i/batchSize) + 1} completed (${batchDuration}ms):`, {
        results: batchResults.map((result, index) => ({
          url: batch[index].url,
          status: result.status,
          ...(result.status === 'rejected' && { reason: result.reason })
        }))
      });
    }
    
    const totalDuration = Date.now() - preloadStartTime;
    debugSuccess(`🏁 PRELOADING PROCESS COMPLETED (${totalDuration}ms total)`);
    
    // Start lazy loading of additional assets for mobile after a delay
    if (isMobile()) {
      setTimeout(() => {
        startLazyLoading();
      }, 2000); // 2 second delay after main loading
    }
    
  }, [generateAssetsList, preloadAsset, addResourceHints, startLazyLoading]);

  useEffect(() => {
    if (DEBUG_PRELOADER) {
      console.log(`
🔧 PRELOADER DEBUG MODE ENABLED 🔧
====================================
Watch the console for detailed preloading information:
- 🚀 Process start/completion
- 🖼️ Image loading details  
- 🎥 Video loading details
- 📊 Progress updates
- ✅ Success messages
- ❌ Error details
- 🏁 Final summary
====================================
      `);
    }
    startPreloading();
  }, [startPreloading]);

  return {
    ...state,
    startPreloading,
  };
};
