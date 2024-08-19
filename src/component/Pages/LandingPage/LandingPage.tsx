import { useState } from "react";
import WelcomeAnimation from "../../WelcomeAnimation/WelcomeAnimation";
import "./LandingPage.scss";

function LandingPage() {
  const [fadeOut, setFadeOut] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [animationOver, setAnimationOver] = useState(false);

  const handleWelcomeAnimationFinish = () => {
    setAnimationOver(true);
    setFadeOut(true);
    setShowPage(true); // Ensure you set showPage to true when the animation finishes.
  };

  return (
    <>
      {!animationOver && (
        <WelcomeAnimation onAnimationFinish={handleWelcomeAnimationFinish} />
      )}
      {showPage && (
        <div className="container">
          <div className={fadeOut ? "fade-in-animation" : ""}>
            <h1 className="test">This is the landing page</h1>
          </div>
        </div>
      )}
    </>
  );
}

export default LandingPage;
