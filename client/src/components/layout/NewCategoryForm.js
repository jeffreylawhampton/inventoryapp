import React, { useState } from "react";
import { TwitterPicker } from "react-color";
import { SliderPicker } from "react-color";

import colors from "../assets/colors.js";

const NewCategoryForm = ({
  handleSubmit,
  handleInputChange,
  formErrors,
  newCategory,
  color,
  handleChange,
}) => {
  const [pickerView, setPickerView] = useState("Twitter");

  const handleTwitterClick = (event) => {
    setPickerView("Twitter");
  };
  const handleSliderClick = (event) => {
    setPickerView("Slider");
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Add a new category</h3>

        <label>
          {!formErrors.name && "Name"}
          <div className="formerror">{formErrors.name}</div>
          <input type="text" name="name" value={newCategory.name} onChange={handleInputChange} />
        </label>

        <div className="picker-links">
          <a onClick={handleTwitterClick}>Pick a color</a> or
          <a onClick={handleSliderClick}>choose your own</a>
        </div>
        <div className="color-picker">
          {pickerView === "Twitter" && (
            <TwitterPicker
              colors={colors}
              triangle={"hide"}
              onChange={handleChange}
              color={color}
              width="auto"
            />
          )}
          {pickerView === "Slider" && (
            <SliderPicker onChange={handleChange} color={color} width="auto" />
          )}
        </div>

        <span className="formerror">{formErrors.category}</span>
        <input type="submit" className="button" value="Submit" />
      </form>
    </>
  );
};

export default NewCategoryForm;
