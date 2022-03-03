import React from "react";
import pic from "../../../public/assets/jeff-hampton-front-end-developer.jpeg";

import IconLinks from "./IconLinks";

const DeveloperInfo = (props) => {
  return (
    <div className="grid-x hero about">
      <div className="cell small-12 large-6">
        <h1>About the developer</h1>
        <p>
          Hi! I'm Jeff Hampton. I make stuff. These days that's mostly web apps, but for the past 10
          years or so I've worked in marketing at several Boston startups. My primary role was
          copywriter, but I picked up some design and development skills along the way, creating
          landing pages, marketing emails, and customer-facing websites. It dawned on me that I
          enjoy making websites far more than writing them, so decided to make a career change.
        </p>
        <p>
          I recently graduated from Launch Academy as a member of the 35th Boston cohort and am
          currently looking for my first official developer position. I'm primarily (okay, entirely)
          interested in front-end design and development. I'm also proficient in the Adobe Creative
          Suite and willing to proofread your website copy while developing, but preferably not
          write it.
        </p>
        <div className="icon-links">
          <IconLinks />
        </div>
      </div>
      <div className="cell small-12 large-6 text-right about-image">
        <img src={pic} />
      </div>
    </div>
  );
};

export default DeveloperInfo;
