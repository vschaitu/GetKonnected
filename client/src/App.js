import React from 'react';
import Login from './views/Login';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Signup from './views/Signup';
import Home from './views/Home';
import Layout from './views/Layout/Layout';
import ChatContainer from './components/chats/ChatContainer'
import appAuth from './components/AppAuth';
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import axios from 'axios';
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from './Events'

const socketUrl = "http://localhost:8080" || process.env.REACT_APP_URL_VAR

const objAuth = {
  socket: io(socketUrl),
  isAuthenticated: null,
  isUserAlreadyinChat: null,
  user: null,
  chatUser: null,
  login(cb) {
    console.log('Authenticating user: ')
    axios.get('/user/')
      .then(response => {
        console.log(response)
        if (response.data.user) {
          console.log('Get User: successful ')
          // check if user already inside chat
          this.socket.emit(VERIFY_USER, response.data.user._id, ({ user, isUser }) => {
            if (isUser) {
              console.log("User name taken")
              this.isUserAlreadyinChat = true
              console.log("isuser already inchat", this.isUserAlreadyinChat)
            } else {
              console.log("we are good", user)
              this.socket.emit(USER_CONNECTED, user)
              this.chatUser = user
            }
            this.isAuthenticated = true
            this.user = response.data.user
            cb(this.isAuthenticated, this.isUserAlreadyinChat, this.chatUser, response.data)
          })
        } else {
          console.log('Get User: No User ')
          this.isAuthenticated = false
          cb(this.isAuthenticated, this.isUserAlreadyinChat, this.chatUser, response.data)
        }
      })
      .catch(error => {
        console.log('Auth Login error')
        console.log(error)
      })
  },
  logout(cb) {
    console.log('logging out')
    axios.post('/user/logout')
      .then(response => {
        console.log(response.data)
        if (response.status === 200) {
          console.log("ok m here")
          this.socket.emit(LOGOUT)
          console.log('Logout User: successful ')
          this.isAuthenticated = false
          this.isUserAlreadyinChat = null
          this.user = null
          this.chatUser = null
          cb()
        }
      })
      .catch(error => {
        console.log('Auth Logout error')
        console.log(error)
      })
  },
};

// let appAuth = new appAuth(objAuth);
// const AuthComponent = appAuth.getComponent();

// <AuthComponent /> 




// export default class Layout extends Component

const App = () => (
  <Router>
    <div>
      <React.Fragment>
        <Route exact path="/login" render={props => <Login {...props} objAuth={objAuth} />} />
        <Route exact path="/signup" objAuth={objAuth} component={Signup} />
        <PrivateRoute exact path="/" objAuth={objAuth} component={ChatContainer} />
        <Route exact path="/emit" component={Layout} />
      </React.Fragment>
    </div>
  </Router>
);

export default App;
