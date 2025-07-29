import { Container } from "../layout/Container";
import { SingleImageShowcaseData } from "../../types/showcase";
import { ShowcaseImage } from "../common/ShowcaseImage";

interface SingleImageShowcaseProps {
  data: SingleImageShowcaseData;
  className?: string;
}

export const SingleImageShowcase = ({ data }: SingleImageShowcaseProps) => {
  const { image } = data;
  return (
    <Container className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
      <ShowcaseImage
        src={image.src}
        alt={image.alt}
        className="w-full h-auto object-contain rounded-2xl border-2 border-muted my-4"
      />
    </Container>
  );
};
