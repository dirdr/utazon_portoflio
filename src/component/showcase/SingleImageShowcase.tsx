import { Container } from "../layout/Container";
import { SingleImageShowcaseData } from "../../types/showcase";
import { ShowcaseImage } from "../common/ShowcaseImage";
import { SHOWCASE_STYLES } from "../../constants/showcaseStyles";
import { cn } from "../../utils/cn";

interface SingleImageShowcaseProps {
  data: SingleImageShowcaseData;
  className?: string;
}

export const SingleImageShowcase = ({ data, className }: SingleImageShowcaseProps) => {
  const { image } = data;
  
  return (
    <Container>
      <div className={cn(SHOWCASE_STYLES.container, className)}>
        <ShowcaseImage
          src={image.src}
          alt={image.alt}
          className={cn(
            "w-full h-auto object-contain",
            SHOWCASE_STYLES.borderRadius,
            SHOWCASE_STYLES.border
          )}
        />
      </div>
    </Container>
  );
};
