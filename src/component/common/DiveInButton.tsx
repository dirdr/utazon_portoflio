import { Button } from "./Button";
import { useTranslation } from "react-i18next";

interface DiveInButtonProps {
  onDiveIn: () => void;
  isReady?: boolean;
  className?: string;
}

export const DiveInButton = ({
  onDiveIn,
  isReady = false,
  className = "",
}: DiveInButtonProps) => {
  const { t } = useTranslation();

  console.log("🔘 DiveInButton render:", {
    isReady,
    className,
    timestamp: Date.now()
  });

  const handleClick = () => {
    console.log("🔘 DiveInButton clicked:", { isReady });
    if (isReady) {
      console.log("🔘 Button is ready - calling onDiveIn");
      onDiveIn();
    } else {
      console.log("🔘 Button not ready - ignoring click");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
    >
      <Button
        as="button"
        onClick={handleClick}
        glint={isReady}
        disabled={!isReady}
        className={`text-2xl font-nord font-bold tracking-widest uppercase transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-50"
        }`}
      >
        {isReady ? t("home.diveIn", "Dive In") : t("home.loading", "Loading...")}
      </Button>
    </div>
  );
};

