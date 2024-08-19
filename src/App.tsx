import { Route, Switch } from "wouter";
import "./App.css";
import LandingPage from "./component/Pages/LandingPage/LandingPage.tsx";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage}></Route>
      </Switch>
    </>
  );
}

export default App;
