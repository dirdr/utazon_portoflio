import { SingleImageShowcaseData } from "../../types/showcase";
import { ShowcaseImage } from "../common/ShowcaseImage";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";

interface SingleImageShowcaseProps {
  data: SingleImageShowcaseData;
  className?: string;
  border?: boolean;
}

export const SingleImageShowcase = ({ 
  data, 
  className,
  border = false
}: SingleImageShowcaseProps) => {
  const { image } = data;
  
  return (
    <div className={cn("w-full", className)}>
      <ShowcaseImage
        src={image.src}
        alt={image.alt}
        className={cn(
          "w-full h-auto object-contain",
          border && SHOWCASE_STYLES.borderRadius,
          border && SHOWCASE_STYLES.border
        )}
      />
    </div>
  );
};
