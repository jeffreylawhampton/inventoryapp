import { element } from "prop-types";
import React, { useState } from "react";

const NewCategoryForm = (props) => {
  const [formErrors, setFormErrors] = useState({});
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "",
    userId: props.user.id,
  });

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

  const colorSelectors = colorArray.map((color) => {
    return (
      <option value={color.toLowerCase()} key={color}>
        {color}
      </option>
    );
  });

  const handleInputChange = (event) => {
    setNewCategory({
      ...newCategory,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const validateInput = (newCategory) => {
    let newFormErrors = {};
    if (!newCategory.name.trim()) {
      newFormErrors.name = "Please enter a name";
    }
    if (props.categories.some((e) => e.name === newCategory.name)) {
      newFormErrors.name = "You already have that, doofus";
    }
    if (newFormErrors.name) {
      setFormErrors(newFormErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    console.log(newCategory);
    event.preventDefault();
    if (validateInput(newCategory)) {
      props.postCategory(newCategory);
      setFormErrors({});
      clearForm();
    }
  };

  const clearForm = () => {
    setNewCategory({
      name: "",
      color: "",
      userId: props.user.id,
    });
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
