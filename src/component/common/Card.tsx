import { cn } from "../../utils/cn";
import { CardProps } from "../../types/card";

export const Card = ({ image, project, className, onClick }: CardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105",
        "bg-gradient-to-br from-white to-black w-full",
        className,
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="font-nord text-xl font-bold text-white mb-2">
            {project.name}
          </h3>
          <p className="font-neue text-sm text-white/90 leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
};

