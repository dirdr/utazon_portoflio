export interface VideoContextProps {
  shouldShowLayout: boolean;
  setShouldShowLayout: (show: boolean) => void;
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}
