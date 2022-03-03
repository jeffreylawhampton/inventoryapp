import React, { useState } from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignOutButton from "../authentication/SignOutButton";
import MobileMenu from "./MobileMenu";

const TopBar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVisible = () => {
    setIsOpen(!isOpen);
  };
  const unauthenticatedListItems = [
    <li key="about">
      <Link className="header-link" to="/about">
        About
      </Link>
    </li>,
    <li key="sign-in">
      <Link className="header-link" to="/user-sessions/new">
        Log in
      </Link>
    </li>,
    <li key="sign-up">
      <Link to="/users/new" className="header-link">
        Create account
      </Link>
    </li>,
  ];

  const authenticatedListItems = [
    <li key="items">
      <Link to="/items" className="header-link">
        Items
      </Link>
    </li>,
    <li key="rooms">
      <Link to="/rooms" className="header-link">
        Rooms
      </Link>
    </li>,
    <li key="categories">
      <Link to="/categories" className="header-link">
        Categories
      </Link>
    </li>,
    <li key="sign-out">
      <SignOutButton />
    </li>,
  ];

  return (
    <>
      <div className="menu-container">
        <div className="top-bar">
          <div className="top-bar-left">
            <Link className="logo" to="/">
              <span className="darkyellow">invent</span>ory
            </Link>
          </div>
          <div className="show-for-medium">
            <ul className="menu">{user ? authenticatedListItems : unauthenticatedListItems}</ul>
          </div>
          <div className="show-for-small-only mobile-menu-right">
            {!isOpen && (
              <svg
                onClick={toggleVisible}
                id="menu-open"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z" />
              </svg>
            )}
            {isOpen && (
              <MobileMenu
                user={user}
                authenticatedListItems={authenticatedListItems}
                unauthenticatedListItems={unauthenticatedListItems}
                toggleVisible={toggleVisible}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
