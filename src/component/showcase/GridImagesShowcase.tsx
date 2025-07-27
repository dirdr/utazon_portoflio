import { Container } from "../layout/Container";
import { ShowcaseImage } from "../common/ShowcaseImage";
import { GridImagesShowcaseData } from "../../types/showcase";

interface GridImagesShowcaseProps {
  data: GridImagesShowcaseData;
}

export const GridImagesShowcase = ({ data }: GridImagesShowcaseProps) => {
  const { images } = data;
  return (
    <Container>
      <div className="grid grid-cols-2 gap-8 my-4">
        {images.map((image, index) => (
          <div key={index} className="w-full">
            <ShowcaseImage
              src={image.src}
              alt={image.alt}
              className="w-full h-auto object-cover rounded-2xl border-2 border-muted"
            />
            {image.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};
