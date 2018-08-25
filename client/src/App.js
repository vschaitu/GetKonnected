import React from 'react';
import Login from './views/Login';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Signup from './views/Signup';
import Home from './views/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import axios from 'axios';
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from './Events'

const socketUrl = "/"

const objAuth = {
  socket: io(socketUrl),
  isAuthenticated: null,
  isUserAlreadyinChat: null,
  user: null,
  chatUser: null,
  login(cb) {

    axios.get('/api/user/')
      .then(response => {

        if (response.data.user) {

          // get display name based on user profile

          let displayName = "Who Am I?"

          if (response.data.user.local) {
            displayName = response.data.user.local.username
          } else if (response.data.user.google) {
            displayName = response.data.user.google.name
          } else if (response.data.user.twitter) {
            displayName = response.data.user.twitter.displayName
          } else  if (response.data.user.facebook) {
            displayName = response.data.user.facebook.name
          }

          // check if user already inside chat
          this.socket.emit(VERIFY_USER, response.data.user._id, displayName, ({ user, isUser }) => {
            if (isUser) {

              this.isUserAlreadyinChat = true

            } else {

              this.socket.emit(USER_CONNECTED, user)
              this.chatUser = user
            }
            this.isAuthenticated = true
            this.user = response.data.user
            cb(this.isAuthenticated, this.isUserAlreadyinChat, this.chatUser, response.data)
          })
        } else {

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

    axios.post('/api/user/logout')
      .then(response => {

        if (response.status === 200) {

          this.socket.emit(LOGOUT)

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






// export default class Layout extends Component

const App = () => (
  <Router>
    <React.Fragment>
      <Route exact path="/login" render={props => <Login {...props} objAuth={objAuth} />} />
      <Route exact path="/signup" objAuth={objAuth} component={Signup} />
      <PrivateRoute exact path="/" objAuth={objAuth} component={Home} />
    </React.Fragment>
  </Router>
);

export default App;
