import React from "react";
import GithubIcon from "../assets/GithubIcon";
import EmailIcon from "../assets/EmailIcon";
import LinkedInIcon from "../assets/LinkedInIcon";

const IconLinks = (props) => {
  return (
    <>
      <a target="_blank" title="Linkedin" href="https://www.linkedin.com/in/jeffreylawhampton/">
        <div className="icon-container">{LinkedInIcon}</div>
      </a>
      <a target="_blank" title="GitHub" href="https://github.com/jeffreylawhampton/">
        <div className="icon-container">{GithubIcon}</div>
      </a>
      <a target="_top" title="Email" href="mailto:jeffreylawhampton@gmail.com">
        <div className="icon-container">{EmailIcon}</div>
      </a>
    </>
  );
};

export default IconLinks;
