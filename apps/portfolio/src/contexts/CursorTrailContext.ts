import { createContext } from "react";

export interface CursorTrailContextValue {
  isEnabled: boolean;
  enableTrail: () => void;
  disableTrail: () => void;
  setTrailEnabled: (enabled: boolean) => void;
}

export const CursorTrailContext = createContext<CursorTrailContextValue | null>(
  null,
);
