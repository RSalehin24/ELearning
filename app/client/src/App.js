import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";

import Landing from "./components/layout/landing";
import Signup from "./components/auth/signup";
import Login from "./components/auth/login";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/auth.action";
import PrivateRoute from "./components/private-routes/privateroute";
import Dashboard from "./components/Deshboard/deshboard";
import "bootstrap/dist/css/bootstrap.min.css";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  //localStorage.removeItem("jwtToken");
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Route exact path="/" component={Landing} />
          <Route exact path="/auth/signup" component={Signup} />
          <Route exact path="/auth/login" component={Login} />
          <Switch>
            <PrivateRoute exact path="/deshboard" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;