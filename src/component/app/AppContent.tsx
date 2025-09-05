import { Layout } from "../layout/Layout";
import { About } from "../pages/About";
import { HomeContainer } from "../pages/HomeContainer";
import { Projects } from "../pages/Projects";
import { ProjectDetail } from "../pages/ProjectDetail";
import { Contact } from "../pages/Contact";
import { Legal } from "../pages/Legal";
import { ROUTES } from "../../constants/routes";
import { Route, Switch, useLocation } from "wouter";
import { ModalProvider } from "../../contexts/ModalContext";
import { TransitionProvider } from "../../contexts/TransitionContext";
import { ModalRoot } from "../common/ModalRoot";
import { CursorTrail } from "../common/CursorTrail";
import { useCursorTrail } from "../../hooks/useCursorTrail";
import { useHomeMobileBreakpoint } from "../../hooks/useHomeMobileBreakpoint";
import { PageTransitionOverlay } from "../layout/PageTransitionOverlay";
import { useTransitionRouter } from "../../hooks/useTransitionRouter";
import { LocomotiveScrollProvider } from "../../contexts/LocomotiveScrollContext";

export const AppContent = () => {
  const { isEnabled } = useCursorTrail();
  const isMobile = useHomeMobileBreakpoint();


  // Transition router with proper navigation control
  const { 
    isTransitioning, 
    currentLocation, 
    progress, 
    navigateWithTransition,
    duration,
    onFadeInComplete
  } = useTransitionRouter({
    duration: 600,
  });

  const isHomePage = currentLocation === "/";

  return (
    <ModalProvider>
      <LocomotiveScrollProvider
        options={{
          smooth: true,
          multiplier: 0.4,
          smoothMobile: false,
          getDirection: true,
          getSpeed: true,
          lerp: 0.05,
          touchMultiplier: 2,
          firefoxMultiplier: 12,
          tablet: {
            smooth: false,
          },
          smartphone: {
            smooth: false,
          },
        }}
        className="min-h-screen"
      >
        <TransitionProvider value={{
          navigateWithTransition,
          navigate: navigateWithTransition, // For now, always use transitions
          isTransitioning,
          currentLocation,
        }}>
          <Layout>
            <Switch location={currentLocation}>
              <Route path={ROUTES.HOME} component={HomeContainer} />
              <Route path={ROUTES.ABOUT} component={About} />
              <Route path={ROUTES.PROJECTS} component={Projects} />
              <Route path="/projects/:id" component={ProjectDetail} />
              <Route path={ROUTES.CONTACT} component={Contact} />
              <Route path={ROUTES.LEGAL} component={Legal} />
              <Route>
                <div className="min-h-screen bg-background flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-5xl font-bold">404</h1>
                    <p className="py-6">Page not found</p>
                  </div>
                </div>
              </Route>
            </Switch>
          </Layout>
          <CursorTrail
            enabled={isEnabled && !isMobile && isHomePage}
            maxPoints={1000}
            fadeTime={2500}
          />
          <ModalRoot />
          
          {/* Global page transition overlay */}
          <PageTransitionOverlay
            isTransitioning={isTransitioning}
            progress={progress}
            duration={duration}
            onFadeInComplete={onFadeInComplete}
          />
        </TransitionProvider>
      </LocomotiveScrollProvider>
    </ModalProvider>
  );
};
