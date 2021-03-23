import "./App.css";
import { Redirect, Route, Switch } from "react-router";
import Competitions from "./components/Competitions/Competitions";
import Competition from "./components/Competition/Competition";
import Team from "./components/Team/Team";
import Header from "./components/Header/Header";

const App = () => {
  return (
    <div className="wrapper">
      <Header />
      <Switch>
        <Route exact path="/">
          <Redirect to="/competitions"/>
        </Route>
        <Route path="/competitions" component={Competitions} />
        <Route path="/competition/:competitionId" component={Competition} />
        <Route path="/team/:teamId" component={Team} />
      </Switch>
    </div>
  );
};

export default App;
