import { ImageShowcaseData } from "../../types/showcase";
import { Container } from "../layout/Container";
import { OptimizedImage } from "../common/OptimizedImage";

interface ImageShowcaseProps {
  data: ImageShowcaseData;
}

export const ImageShowcase = ({ data }: ImageShowcaseProps) => {
  const { mainImage, bottomImages } = data;

  return (
    <section className="w-full">
      <Container>
        <div className="space-y-4">
          <div className="w-full">
            <OptimizedImage
              src={mainImage.src}
              alt={mainImage.alt}
              className="w-full h-screen object-cover rounded-xl border-2 border-muted"
            />
            {mainImage.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {mainImage.caption}
              </p>
            )}
          </div>

          {bottomImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {bottomImages.map((image, index) => (
                <div key={index} className="w-full">
                  <OptimizedImage
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-cover rounded-xl border-2 border-muted"
                  />
                  {image.caption && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

