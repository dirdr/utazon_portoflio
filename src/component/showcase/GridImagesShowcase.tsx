import { ShowcaseImage } from "../common/ShowcaseImage";
import { GridImagesShowcaseData } from "../../types/showcase";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";

interface GridImagesShowcaseProps {
  data: GridImagesShowcaseData;
  className?: string;
  border?: boolean;
}

export const GridImagesShowcase = ({
  data,
  className,
  border = false
}: GridImagesShowcaseProps) => {
  const { images } = data;

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="w-full">
            <ShowcaseImage
              src={image.src}
              alt={image.alt}
              className={cn(
                "w-full aspect-video object-cover",
                border && SHOWCASE_STYLES.borderRadius,
                border && SHOWCASE_STYLES.border,
              )}
            />
            {image.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
