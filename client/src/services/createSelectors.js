import React from "react";
const createSelectors = (elementArray) => {
  if (!elementArray) return [];
  return elementArray.map((element) => {
    return (
      <option key={element.id} value={element.id}>
        {element.name}
      </option>
    );
  });
};

export default createSelectors;
