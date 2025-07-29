import { Container } from "../layout/Container";
import { SingleImageShowcaseData } from "../../types/showcase";
import { ShowcaseImage } from "../common/ShowcaseImage";

interface SingleImageShowcaseProps {
  data: SingleImageShowcaseData;
  className?: string;
}

export const SingleImageShowcase = ({ data, className = "" }: SingleImageShowcaseProps) => {
  const { image } = data;
  return (
    <Container>
      <div className={`px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 ${className}`}>
        <ShowcaseImage
          src={image.src}
          alt={image.alt}
          className="w-full h-auto object-contain rounded-2xl border-2 border-muted my-4"
        />
      </div>
    </Container>
  );
};
