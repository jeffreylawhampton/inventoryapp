import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import fetchUserData from "../../services/fetchUserData";
import findExistingElement from "../../services/findExistingElement";
import makeObjectAbc from "../../services/makeOjbectsAbc";

import AccordionTile from "./AccordionTile";
import NewCategoryForm from "./NewCategoryForm";
import PlusIcon from "./PlusIcon";
import SearchForm from "./SearchForm";
import Postman from "../../services/Postman";

const CategoryList = (props) => {
  const { user } = props;
  const userId = user.id;

  const [errors, setErrors] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#ddd",
    userId: userId,
  });
  const [color, setColor] = useState({
    color: "#ddd",
  });

  const getUserData = async () => {
    const userData = await fetchUserData(userId);
    const categoryData = makeObjectAbc(userData.categories);
    const itemData = makeObjectAbc(userData.items);
    const filteredCategories = categoryData.map((category) => {
      category.items = itemData.filter((item) => item.categoryId === category.id);
      return category;
    });
    setCategoryList(filteredCategories);
    setItemList(itemData);
  };

  const validateInput = (newCategory) => {
    let newFormErrors = {};
    if (!newCategory.name.trim()) {
      newFormErrors.name = "Please enter a name";
    }

    let duplicate = findExistingElement("categories", newCategory.name, categoryList);
    if (duplicate) newFormErrors.name = duplicate;

    if (newFormErrors.name) {
      setFormErrors(newFormErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInput(newCategory)) {
      newCategory.color = color;
      const postedCategory = await Postman.postCategory(newCategory);
      if (postedCategory.responseType === "success") {
        setFormErrors({});
        setCategoryList(makeObjectAbc([...categoryList, postedCategory.responseBody]));
        setShowNewCategoryForm(!showNewCategoryForm);
      }
      if (postedCategory.responseType === "server errors") {
        setErrors(postedCategory.errors);
      }
      if (postedCategory.responseType === "failure") {
        console.error(postedCategory.errors);
      }
    }
  };
  const handleInputChange = (event) => {
    setNewCategory({
      ...newCategory,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const clearForm = () => {
    setNewCategory({
      name: "",
      color: "",
      userId: userId,
    });
  };

  const categoryClickHandler = (event) => {
    event.preventDefault();
    clearForm();
    setShowNewCategoryForm(!showNewCategoryForm);
  };

  const onInputChange = (event) => {
    event.preventDefault();
    setSearchString(event.currentTarget.value);
  };

  const handleChange = (color, event) => {
    setColor(color.hex);
  };

  let searchedItems = categoryList.filter((category) => {
    return category.name.toLowerCase().startsWith(searchString.toLowerCase());
  });

  const searchTiles = searchedItems.map((cardObject) => {
    if (!cardObject.color) {
      cardObject.color = "gray";
    }
    return (
      <AccordionTile
        key={cardObject.id}
        cardObject={cardObject}
        parentLink="categories"
        colorClass={cardObject.color}
      />
    );
  });

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="item-list-container">
      <h1>My categories</h1>
      <SearchForm
        searchString={searchString}
        onInputChange={onInputChange}
        placeholder="Find a category"
      />
      <div className="search-container">{searchTiles}</div>

      <div onClick={categoryClickHandler} className="circle-button-container">
        <PlusIcon iconPosition={showNewCategoryForm ? "x" : "plus"} />
      </div>
      {showNewCategoryForm && (
        <div className="form-modal">
          <NewCategoryForm
            newCategory={newCategory}
            formErrors={formErrors}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            handleChange={handleChange}
            color={color}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryList;
