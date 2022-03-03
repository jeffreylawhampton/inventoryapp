import React from "react";
import { Link } from "react-router-dom";

import IconLinks from "./IconLinks";

const Footer = (props) => {
  const footerLinks = [
    <li key="home">
      <Link to="/" className="footer-link">
        Home
      </Link>
    </li>,
    <li key="about">
      <Link to="/about" className="footer-link">
        About
      </Link>
    </li>,
  ];
  return (
    <div className="footer">
      <div className="container">
        <div className="grid-x footer-icons">
          <IconLinks />
        </div>
        <div className="footer-links">
          <ul>{footerLinks}</ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
