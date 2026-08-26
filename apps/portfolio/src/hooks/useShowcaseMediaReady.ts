import { useEffect, useMemo, useState } from "react";
import { ShowcaseData } from "../types/showcase";
import { extractShowcasesVideoKeys } from "../utils/extractProjectVideoKeys";
import { prefetchPresignedUrls } from "./usePresignedVideoUrl";
import { presignedUrlCache } from "../services/PresignedUrlCache";
import { isMobile } from "../utils/mobileDetection";

/**
 * How many showcases the reveal waits on. Everything below that streams in
 * behind its own placeholder, so the page never gates on its heaviest clip.
 */
const GATED_SHOWCASES_DESKTOP = 2;
const GATED_SHOWCASES_MOBILE = 1;

/** A single slow clip must never hold the page hostage. */
const REVEAL_TIMEOUT_MS = 8000;

interface SaveDataConnection {
  saveData?: boolean;
}

/** True when the browser asks us not to spend the user's data budget. */
function prefersReducedData(): boolean {
  const connection = (
    navigator as Navigator & { connection?: SaveDataConnection }
  ).connection;
  return connection?.saveData === true;
}

/** Warm one clip until it holds a decoded frame (HAVE_CURRENT_DATA). */
function warmVideo(url: string): Promise<void> {
  return new Promise((resolve) => {
    const element = document.createElement("video");
    element.preload = "auto";
    element.muted = true;
    element.playsInline = true;

    const settle = () => {
      element.removeEventListener("loadeddata", settle);
      element.removeEventListener("error", settle);
      // Release the buffer; the bytes stay in the HTTP cache, which is all the
      // real player needs to start without a black frame.
      element.removeAttribute("src");
      element.load();
      resolve();
    };

    // Resolving on error is deliberate: a broken asset should surface as one
    // failed tile, not as a page that never appears.
    element.addEventListener("loadeddata", settle);
    element.addEventListener("error", settle);

    element.src = url;
    element.load();
  });
}

/**
 * Gate a project page on the media above the fold.
 *
 * Resolves presigned URLs for every clip on the page, then buffers a first
 * frame for the leading showcases only. The page reveals in one go instead of
 * letting tiles pop in over a black background, without waiting on clips the
 * reader has not scrolled to yet.
 */
export function useShowcaseMediaReady(showcases: ShowcaseData[]): boolean {
  const allKeys = useMemo(
    () => extractShowcasesVideoKeys(showcases),
    [showcases],
  );

  const gatedKeys = useMemo(() => {
    const count = isMobile() ? GATED_SHOWCASES_MOBILE : GATED_SHOWCASES_DESKTOP;
    return extractShowcasesVideoKeys(showcases.slice(0, count));
  }, [showcases]);

  // The arrays are rebuilt on every render of the caller; compare by content.
  const allSignature = allKeys.join("|");
  const gatedSignature = gatedKeys.join("|");

  const [ready, setReady] = useState(() => allKeys.length === 0);

  useEffect(() => {
    const all = allSignature ? allSignature.split("|") : [];

    if (all.length === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

    const reveal = () => {
      if (!cancelled) setReady(true);
    };

    const timer = setTimeout(reveal, REVEAL_TIMEOUT_MS);

    (async () => {
      // Presign everything: it is a small JSON call per clip, and the tiles
      // below the fold would otherwise pay that latency on top of their bytes.
      await prefetchPresignedUrls(all);
      if (cancelled) return;

      if (prefersReducedData()) {
        reveal();
        return;
      }

      const gated = gatedSignature ? gatedSignature.split("|") : [];
      const urls = gated
        .map((key) => presignedUrlCache.get(key))
        .filter((url): url is string => Boolean(url));

      await Promise.all(urls.map(warmVideo));
      reveal();
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [allSignature, gatedSignature]);

  return ready;
}
