import { isMobile } from "./mobileDetection";

/**
 * How far outside the viewport to start loading media.
 *
 * 200px was about a quarter of a phone screen, which a flick scroll crosses
 * long before a fetch completes. A viewport-relative band tracks the device
 * instead, and mobile takes a smaller one to keep cellular data in check.
 */
export const readAheadMargin = (): string =>
  isMobile() ? "60vh 0px" : "100vh 0px";
