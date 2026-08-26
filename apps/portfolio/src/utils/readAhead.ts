import { isMobile } from "./mobileDetection";

/**
 * How far outside the viewport to start loading media.
 *
 * 200px was about a quarter of a phone screen, which a flick scroll crosses
 * long before a fetch completes. Percentages resolve against the root's own
 * dimensions, so 100% is one viewport height; mobile takes a smaller band to
 * keep cellular data in check.
 *
 * Must stay in px or %. IntersectionObserver rejects any other unit, and it
 * throws from the constructor, which takes the whole page down with it.
 */
export const readAheadMargin = (): string =>
  isMobile() ? "60% 0px" : "100% 0px";
