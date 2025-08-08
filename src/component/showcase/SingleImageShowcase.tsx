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
      <div className={`w-full max-w-[90%] mx-auto my-4 ${className}`}>
        <ShowcaseImage
          src={image.src}
          alt={image.alt}
          className="w-full h-auto object-contain rounded-2xl border-1 lg:border-2 border-muted"
        />
      </div>
    </Container>
  );
};
