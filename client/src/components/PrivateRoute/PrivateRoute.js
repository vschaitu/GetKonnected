import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

const PrivateRoute = ({ component: Component, objAuth, ...rest }) => {

  return (<Route
    {...rest}
    render={props =>
      (objAuth.isAuthenticated && !objAuth.isUserAlreadyinChat) ? (
        <Component {...props} objAuth={objAuth} />
      ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
            objAuth={objAuth}
          />
        )
    }
  />
  )
};

export default PrivateRoute;