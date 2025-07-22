import { Container } from "../layout/Container";
import { VideoCard } from "../Showreel/VideoCard";

export const Showreel = () => (
  <div className="flex items-center justify-center p-4">
    <Container className="flex items-center justify-center">
      <VideoCard 
        src="/videos/showreel.webm" 
        className="w-full max-w-screen-xl" 
      />
    </Container>
  </div>
);
