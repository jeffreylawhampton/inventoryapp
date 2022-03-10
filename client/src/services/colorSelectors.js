import React from "react";
const colorArray = [
  "Yellow",
  "Orange",
  "Mauve",
  "Maroon",
  "Rose",
  "Red",
  "Purple",
  "Indigo",
  "Wintergreen",
  "Green",
  "Navy",
  "Blue",
];

const colorSelectors = colorArray.sort().map((color) => {
  return (
    <option value={color.toLowerCase()} key={color}>
      {color}
    </option>
  );
});

export default colorSelectors;
