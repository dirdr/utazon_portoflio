import { t } from "i18next";

export interface CopyrightOverlayProps {
  /**
   * Translation key for the copyright text
   */
  translationKey: string;

  /**
   * Additional CSS classes for customization
   */
  className?: string;
}

/**
 * Reusable copyright overlay component for videos
 *
 * Displays small white text at the bottom of the video
 * without any background, for a clean minimal look.
 */
export const CopyrightOverlay = ({
  translationKey,
  className = "",
}: CopyrightOverlayProps) => {
  return (
    <div className={`absolute bottom-2 left-0 w-full text-center ${className}`}>
      <p className="text-xs text-white px-2 py-1 inline-block">
        {t(translationKey)}
      </p>
    </div>
  );
};
