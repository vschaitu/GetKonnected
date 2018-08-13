import React from 'react';
import Login from './views/Login';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Signup from './views/Signup';
import Home from './views/Home';
import Layout from './views/Layout/Layout';
import appAuth from './components/AppAuth';
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import axios from 'axios';

const objAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    console.log('Authenticating user: ')
    axios.get('/user/')
      .then(response => {
        console.log(response)
        if (response.data.user) {
          console.log('Get User: successful ')
          this.isAuthenticated = true
          this.user = response.data.user
        } else {
          console.log('Get User: No User ')
          this.isAuthenticated = false
        }
        cb(response.data)
      })
      .catch(error => {
        console.log('Auth Login error')
        console.log(error)
      })
  },
  logout() {
    console.log('logging out')
    axios.post('/user/logout')
      .then(response => {
        console.log(response.data)
        if (response.status === 200) {
          console.log('Logout User: successful ')
          this.isAuthenticated = false
          delete this.user
        }
      })
      .catch(error => {
        console.log('Auth Logout error')
        console.log(error)
      })
  }
};

// let appAuth = new appAuth(objAuth);
// const AuthComponent = appAuth.getComponent();

// <AuthComponent /> 

const App = () => (
  <Router>
    <div>
      <React.Fragment>
        <Route exact path="/login" render={props => <Login {...props} objAuth={objAuth} />} />
        <Route exact path="/signup" objAuth={objAuth} component={Signup} />
        <PrivateRoute exact path="/" objAuth={objAuth} component={Home} />
        <Route exact path="/emit" component={Layout} />
      </React.Fragment>
    </div>
  </Router>
);

export default App;
