import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ SSR-safe
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);
    listener(); // run immediately

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
