import React from 'react';
import Login from './views/Login';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signup from './views/Signup';
import Home from './views/Home';

const App = () => (
  <Router>
    <React.Fragment>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/" component={Home} />
      </Switch>
    </React.Fragment>
  </Router>
);

export default App;
