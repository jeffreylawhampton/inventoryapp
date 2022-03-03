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
        <li key="about">
          <Link to="/about" className="header-link">
            About
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobileMenu;
