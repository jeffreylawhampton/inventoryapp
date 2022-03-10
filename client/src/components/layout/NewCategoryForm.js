import React, { useState } from "react";
import colorSelectors from "../../services/colorSelectors";

const NewCategoryForm = ({ handleSubmit, handleInputChange, formErrors, newCategory }) => {
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
          Color
          <select name="color" value={newCategory.color} onChange={handleInputChange}>
            <option value="" className="disabled" disabled>
              Pick a color, any color
            </option>
            {colorSelectors}
          </select>
        </label>
        <span className="formerror">{formErrors.category}</span>
        <input type="submit" className="button" value="Submit" />
      </form>
    </>
  );
};

export default NewCategoryForm;
