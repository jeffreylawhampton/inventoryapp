import React, { useState, useEffect, useReducer } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { hot } from "react-hot-loader/root";

import getCurrentUser from "../services/getCurrentUser";
import "../assets/scss/main.scss";
import RegistrationForm from "./registration/RegistrationForm";
import SignInForm from "./authentication/SignInForm";
import TopBar from "./layout/TopBar";
import ItemList from "./layout/ItemList";
import CategoryList from "./layout/CategoryList";
import AuthenticatedRoute from "./authentication/AuthenticatedRoute.js";
import CategoryShow from "./layout/CategoryShow";
import RoomShow from "./layout/RoomShow";
import ItemShow from "./layout/ItemShow";
import LandingPage from "./layout/LandingPage";
import UpdatedRoomsList from "./layout/UpdatedRoomsList";

const App = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setUserId(user.id);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <BrowserRouter>
      <Route exact path="/users/new" component={RegistrationForm} />
      <Route exact path="/user-sessions/new" component={SignInForm} />
      <TopBar user={currentUser} />

      <div className="page-container">
        <Switch>
          <Route exact path="/">
            <LandingPage user={currentUser} />
          </Route>
          <AuthenticatedRoute
            exact
            path="/categories"
            component={CategoryList}
            user={currentUser}
          />

          <AuthenticatedRoute
            exact
            path="/categories/:id"
            component={CategoryShow}
            user={currentUser}
          />
          <AuthenticatedRoute exact path="/items" component={ItemList} user={currentUser} />
          <AuthenticatedRoute exact path="/items/:id" component={ItemShow} user={currentUser} />
          <AuthenticatedRoute exact path="/rooms" component={UpdatedRoomsList} user={currentUser} />
          <AuthenticatedRoute exact path="/rooms/:id" component={RoomShow} user={currentUser} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default hot(App);
