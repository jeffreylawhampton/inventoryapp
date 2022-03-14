import React, { useState } from "react";
import { SketchPicker } from "react-color";

import colors from "../assets/colors.js";

const NewCategoryForm = ({
  handleSubmit,
  handleInputChange,
  formErrors,
  newCategory,
  color,
  handleChange,
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  return (
    <>
      {displayColorPicker ? (
        <div className="picker-wrapper">
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
        </div>
      ) : null}
      <div className="form-modal">
        <form onSubmit={handleSubmit}>
          <h3>Add a new category</h3>
          <label>
            {!formErrors.name && "Name"}
            <div className="formerror">{formErrors.name}</div>
            <input type="text" name="name" value={newCategory.name} onChange={handleInputChange} />
          </label>{" "}
          <div className="picker">
            <a onClick={handleClick}>Color</a>
            <div className="swatch" onClick={handleClick}>
              <div className="swatch-background" style={{ background: color }} />
            </div>
          </div>
          <span className="formerror">{formErrors.category}</span>
          <input type="submit" className="button" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default NewCategoryForm;
