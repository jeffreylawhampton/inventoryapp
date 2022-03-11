import React, { useState } from "react";
import { TwitterPicker } from "react-color";

import colors from "../assets/colors.js";

const NewCategoryForm = ({
  handleSubmit,
  handleInputChange,
  formErrors,
  newCategory,
  color,
  handleChange,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Add a new category</h3>

        <label>
          {!formErrors.name && "Name"}
          <div className="formerror">{formErrors.name}</div>
          <input type="text" name="name" value={newCategory.name} onChange={handleInputChange} />
        </label>
        <label>
          <p style={{ color: color }} className="sample-color">
            Color
          </p>

          <TwitterPicker colors={colors} onChange={handleChange} color={color} width="auto" />
        </label>
        <span className="formerror">{formErrors.category}</span>
        <input type="submit" className="button" value="Submit" />
      </form>
    </>
  );
};

export default NewCategoryForm;
