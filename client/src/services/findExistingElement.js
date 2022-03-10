import React from "react";
import { Link } from "react-router-dom";

const findExistingElement = (type, newElementName, elementList) => {
  const existingElement = elementList.find((element) => element.name === newElementName);
  if (!existingElement) return false;
  let existingElementLink = (
    <Link to={`/${type}/${existingElement.id}`}>
      You already have that <u>here</u>
    </Link>
  );
  return existingElementLink;
};

export default findExistingElement;
