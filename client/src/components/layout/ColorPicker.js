import React, { useState } from "react";
import { SketchPicker } from "react-color";

import colors from "../assets/colors";

const ColorPicker = ({ color, handleChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  return (
    <>
      <div className="picker">
        <a onClick={handleClick}>Color</a>
        <div className="swatch" onClick={handleClick}>
          <div className="swatch-background" style={{ background: color }} />
        </div>
      </div>
      {displayColorPicker ? (
        <>
          <div
            style={{
              background: color,
            }}
            className="picker-background"
            onClick={handleClose}
          ></div>

          <div className="picker-content">
            <SketchPicker
              color={color}
              onChange={handleChange}
              presetColors={colors}
              width={"100%"}
              disableAlpha={true}
            />
          </div>
        </>
      ) : null}
    </>
  );
};

export default ColorPicker;
