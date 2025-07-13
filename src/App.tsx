import { Layout } from "./component/layout/Layout";
import { About } from "./component/Pages/About";
import { Home } from "./component/Pages/Home";
import { Projects } from "./component/Pages/Projects";
import { ProjectDetail } from "./component/Pages/ProjectDetail";
import { Contact } from "./component/Pages/Contact";
import { Showreel } from "./component/Pages/Showreel";
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
        <Route>
          {/* 404 Page */}
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
