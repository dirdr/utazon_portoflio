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
import { SimpleFadeTransition } from "./component/transitions/SimpleFadeTransition";
import "./index.css";
import { Route, Switch, useLocation } from "wouter";

function App() {
  const [location] = useLocation();

  return (
    <AppWrapper>
      <Layout>
        <SimpleFadeTransition pageKey={location} duration={0.5}>
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
        </SimpleFadeTransition>
      </Layout>
    </AppWrapper>
  );
}

export default App;
