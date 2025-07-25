import React from "react";
import { Layout } from "./component/layout/Layout";
import { About } from "./component/pages/About";
import { Home } from "./component/pages/Home";
import { Projects } from "./component/pages/Projects";
import { ProjectDetail } from "./component/pages/ProjectDetail";
import { Contact } from "./component/pages/Contact";
import { Showreel } from "./component/pages/Showreel";
import { Legal } from "./component/pages/Legal";
import { ROUTES } from "./constants/routes";
import { AppWrapper } from "./component/app/AppWrapper";
import { PageTransition } from "./component/transitions/PageTransition";
import { Footer } from "./component/layout/Footer";
import { getPageConfig } from "./config/pageConfig";
import { VideoProvider } from "./contexts/VideoContext";
import { useVideo } from "./hooks/useVideo";
import "./index.css";
import { Route, Switch, useLocation } from "wouter";

function App() {
  const [location] = useLocation();
  const pageConfig = getPageConfig(location);
  const isHomePage = location === "/";
  
  // Track previous location to determine if we should skip transitions
  const [previousLocation, setPreviousLocation] = React.useState(location);
  React.useEffect(() => {
    setPreviousLocation(location);
  }, [location]);
  
  // Skip transitions when navigating FROM home page (but not TO home)
  const shouldSkipTransition = !isHomePage && previousLocation === "/";
  
  console.log('🔄 App.tsx Navigation Debug:', {
    location,
    previousLocation,
    isHomePage,
    shouldSkipTransition,
    renderingBranch: isHomePage ? 'HOME' : shouldSkipTransition ? 'SKIP_TRANSITION' : 'NORMAL_TRANSITION'
  });

  return (
    <AppWrapper>
      <VideoProvider>
        <Layout>
          {isHomePage ? (
            // Home page: Simple direct rendering 
            <div className="h-full">
              <Switch location={location}>
                <Route path={ROUTES.HOME} component={Home} />
              </Switch>
            </div>
          ) : shouldSkipTransition ? (
            // Skip transitions when navigating to/from home page - instant render
            <div className="min-h-full flex flex-col">
              <div className="flex-1">
                <Switch location={location}>
                  <Route path={ROUTES.ABOUT} component={About} />
                  <Route path={ROUTES.PROJECTS} component={Projects} />
                  <Route path="/projects/:id" component={ProjectDetail} />
                  <Route path={ROUTES.CONTACT} component={Contact} />
                  <Route path={ROUTES.SHOWREEL} component={Showreel} />
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
              </div>
              {pageConfig.showFooter && <Footer />}
            </div>
          ) : (
            // Other pages: Normal page transitions
            <PageTransition pageKey={location}>
              <div className="min-h-full flex flex-col">
                <div className="flex-1">
                  <Switch location={location}>
                    <Route path={ROUTES.ABOUT} component={About} />
                    <Route path={ROUTES.PROJECTS} component={Projects} />
                    <Route path="/projects/:id" component={ProjectDetail} />
                    <Route path={ROUTES.CONTACT} component={Contact} />
                    <Route path={ROUTES.SHOWREEL} component={Showreel} />
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
                </div>
                {pageConfig.showFooter && <Footer />}
              </div>
            </PageTransition>
          )}
        </Layout>
      </VideoProvider>
    </AppWrapper>
  );
}

export default App;
