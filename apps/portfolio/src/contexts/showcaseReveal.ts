import { createContext, useContext } from "react";

/**
 * Whether showcase media may drop its placeholder yet.
 *
 * Defaults to true so a showcase component rendered outside a project page
 * behaves normally on its own.
 */
export const ShowcaseRevealContext = createContext(true);

export const useShowcaseRevealed = () => useContext(ShowcaseRevealContext);
