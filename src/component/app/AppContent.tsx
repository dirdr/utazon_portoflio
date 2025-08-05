import { Layout } from "../layout/Layout";
import { About } from "../pages/About";
import { HomeContainer } from "../pages/HomeContainer";
import { Projects } from "../pages/Projects";
import { ProjectDetail } from "../pages/ProjectDetail";
import { Contact } from "../pages/Contact";
import { Showreel } from "../pages/Showreel";
import { Legal } from "../pages/Legal";
import { ROUTES } from "../../constants/routes";
import { PageTransition } from "../transitions/PageTransition";
import { Footer } from "../layout/Footer";
import { getPageConfig } from "../../config/pageConfig";
import { Route, Switch, useLocation } from "wouter";

export const AppContent = () => {
  const [location] = useLocation();
  const pageConfig = getPageConfig(location);
  const isHomePage = location === "/";
  

  return (
    <Layout>
      <PageTransition pageKey={location}>
        <div className={`${isHomePage ? "h-full" : "min-h-full"} flex flex-col`}>
          <div className="flex-1">
            <Switch location={location}>
              <Route path={ROUTES.HOME} component={HomeContainer} />
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
    </Layout>
  );
};