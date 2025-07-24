import { Layout } from "./component/layout/Layout";
import { About } from "./component/pages/About.tsx";
import { Home } from "./component/pages/Home.tsx";
import { Projects } from "./component/pages/Projects.tsx";
import { ProjectDetail } from "./component/pages/ProjectDetail.tsx";
import { Contact } from "./component/pages/Contact.tsx";
import { Showreel } from "./component/pages/Showreel.tsx";
import { Legal } from "./component/pages/Legal.tsx";
import { ROUTES } from "./constants/routes";
import "./index.css";
import { Route, Switch } from "wouter";
function App() {
  return (
    <Layout>
      <Switch>
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
    </Layout>
  );
}

export default App;
