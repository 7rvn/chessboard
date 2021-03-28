import * as React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import LegalMovesOnly from "./demos/LegalMovesOnly";
import RandomVsRandom from "./demos/RandomVsRandom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/legalmoves" component={LegalMovesOnly}></Route>
        <Route path="/randomvsrandom" component={RandomVsRandom}></Route>
      </Switch>
    </Router>
  );
}

export default App;
