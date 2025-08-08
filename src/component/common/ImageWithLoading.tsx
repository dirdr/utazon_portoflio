import { useImageLoadState } from "../../hooks/useImageLoadState";

interface ImageWithLoadingProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
}

export const ImageWithLoading = ({ 
  src, 
  alt, 
  className = "", 
  placeholderClassName = ""
}: ImageWithLoadingProps) => {
  const { isLoaded } = useImageLoadState(src);

  return (
    <div className="relative">
      {!isLoaded && (
        <div className={`bg-black animate-pulse ${placeholderClassName}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
};