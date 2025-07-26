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
import { HomeToPageTransition } from "./component/transitions/HomeToPageTransition";
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
  
  const previousLocationRef = React.useRef(location);
  const isFromHome = previousLocationRef.current === "/";
  
  React.useEffect(() => {
    previousLocationRef.current = location;
  });
  

  return (
    <AppWrapper>
      <VideoProvider>
        <Layout>
          <HomeToPageTransition pageKey={location} isFromHome={isFromHome}>
            <div className={`${isHomePage ? "h-full" : "min-h-full"} flex flex-col`}>
              <div className="flex-1">
                <Switch location={location}>
                  <Route path={ROUTES.HOME} component={Home} />
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
          </HomeToPageTransition>
        </Layout>
      </VideoProvider>
    </AppWrapper>
  );
}

export default App;
