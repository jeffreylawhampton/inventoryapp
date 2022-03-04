import React, { useState } from "react";
import { Link } from "react-router-dom";

import MenuCloseIcon from "../assets/MenuCloseIcon";

const MobileMenu = ({ user, authenticatedListItems, unauthenticatedListItems, toggleVisible }) => {
  return (
    <div className="mobile-menu">
      <div className="menuicon" onClick={toggleVisible}>
        {MenuCloseIcon}
      </div>
      <ul className="mobilemenu" onClick={toggleVisible}>
        <Link className="logo" to="/">
          <span className="darkyellow">invent</span>ory
        </Link>
        {user ? authenticatedListItems : unauthenticatedListItems}
        <li key="aboutinventory">
          <Link to="/about?view=inventory" className="header-link">
            About Inventory
          </Link>
        </li>

        <li key="aboutdeveloper">
          <Link to="/about?view=developer" className="header-link">
            About the developer
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobileMenu;
