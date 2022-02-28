import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

const Profile = (props) => {
  const { user } = props;
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    setCurrentUser(user);
  });

  return (
    <>
      <h1>Hello from Profile</h1>
      {currentUser && <p>I'm logged in</p>}
      {!currentUser && <p>I'm not</p>}
    </>
  );
};

export default Profile;
