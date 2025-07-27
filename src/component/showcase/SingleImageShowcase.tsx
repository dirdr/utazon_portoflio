import { Container } from "../layout/Container";
import { SingleImageShowcaseData } from "../../types/showcase";
import { ShowcaseImage } from "../common/ShowcaseImage";

interface SingleImageShowcaseProps {
  data: SingleImageShowcaseData;
}

export const SingleImageShowcase = ({ data }: SingleImageShowcaseProps) => {
  const { image } = data;
  return (
    <Container>
      <ShowcaseImage
        src={image.src}
        alt={image.alt}
        className="w-full h-screen object-cover rounded-2xl border-2 border-muted my-4"
      />
    </Container>
  );
};
