import { Button } from "./Button";
import { useTranslation } from "react-i18next";

interface DiveInButtonProps {
  onDiveIn: () => void;
  className?: string;
}

export const DiveInButton = ({
  onDiveIn,
  className = "",
}: DiveInButtonProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
    >
      <Button
        as="button"
        onClick={onDiveIn}
        glint={true}
        className="text-2xl font-nord font-bold tracking-widest uppercase"
      >
        {t("home.diveIn", "Dive In")}
      </Button>
    </div>
  );
};

