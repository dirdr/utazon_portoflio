import { Layout } from "./component/layout/Layout";
import { About } from "./component/Pages/About";
import { Home } from "./component/Pages/Home";
import "./index.scss";
import { Route, Switch } from "wouter";

function App() {
  return (
    <>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route>
            {/* 404 Page */}
            <div className="hero min-h-screen bg-base-200">
              <div className="hero-content text-center">
                <div>
                  <h1 className="text-5xl font-bold">404</h1>
                  <p className="py-6">Page not found</p>
                </div>
              </div>
            </div>
          </Route>
        </Switch>
      </Layout>{" "}
    </>
  );
}

export default App;
