import React from "react";
import { Route, Switch, Link } from "react-router-dom";

const LoggedOutLandingPage = (props) => {
  return (
    <>
      <div className="hero grid-x">
        <div className="cell small-12 medium-6 large-7">
          <div className="content">
            <h1>Welcome to Inventory</h1>
            <p>
              Long on stuff and short on memory? You're in the right place. Enjoy the gratuitous dog
              pic.
            </p>

            <Link to="/user-sessions/new" className="button yellow">
              Sign in
            </Link>
            <br />
            <Link to="/users/new">Or start a free account</Link>
          </div>
        </div>

        <div className="cell small-12 medium-6 large-5 pic">
          <img
            src="https://jh-inventory-app-production.s3.amazonaws.com/1646037560638"
            className="penny"
            alt="Adorable pup with too big a tongue for her mouth. Poor thing."
          />
        </div>
      </div>
    </>
  );
};

export default LoggedOutLandingPage;
