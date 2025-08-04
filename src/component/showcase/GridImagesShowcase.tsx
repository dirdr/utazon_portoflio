import { Container } from "../layout/Container";
import { ShowcaseImage } from "../common/ShowcaseImage";
import { GridImagesShowcaseData } from "../../types/showcase";

interface GridImagesShowcaseProps {
  data: GridImagesShowcaseData;
  className?: string;
}

export const GridImagesShowcase = ({ data, className = "" }: GridImagesShowcaseProps) => {
  const { images } = data;
  return (
    <Container>
      <div className={`w-full my-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 ${className}`}>
        <div className="grid grid-cols-2 gap-8">
          {images.map((image, index) => (
            <div key={index} className="w-full">
              <ShowcaseImage
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover rounded-2xl border-1 lg:border-2 border-muted"
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
    </Container>
  );
};
