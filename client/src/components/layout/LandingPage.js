import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import LoggedOutLandingPage from "./LoggedOutLandingPage";
import makeObjectAbc from "../../services/makeOjbectsAbc.js";
import ItemList from "./ItemList";

const LandingPage = (props) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentView, setCurrentView] = useState("items");

  let userId;
  let loggedIn = false;
  if (props.user) {
    loggedIn = true;
    userId = props.user.id;
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/v1/users/${userId}`);
      if (!response.ok) {
        const errorMessage = `${response.status}: (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();

      const items = makeObjectAbc(body.user.items);
      const categories = makeObjectAbc(body.user.categories);
      const userRooms = makeObjectAbc(body.user.rooms);
      setItems(items);
      setCategories(categories);
      setRooms(userRooms);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      {loggedIn && (
        <>
          <ItemList user={props.user} items={items} />
        </>
      )}
      {!loggedIn && <LoggedOutLandingPage />}
    </div>
  );
};

export default LandingPage;
