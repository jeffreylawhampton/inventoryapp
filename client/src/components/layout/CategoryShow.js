import React, { useState, useEffect } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";
import { TwitterPicker } from "react-color";
import { SliderPicker } from "react-color";

import createSelectors from "../../services/createSelectors.js";
import colors from "../assets/colors.js";
import fetchUserData from "../../services/fetchUserData.js";
import makeObjectAbc from "../../services/makeOjbectsAbc.js";
import Postman from "../../services/Postman.js";

import EditIcon from "../assets/EditIcon";
import ItemTile from "./ItemTile";
import PlusIcon from "./PlusIcon";
import SearchForm from "./SearchForm";

const CategoryShow = (props) => {
  const user = props.user;
  const userId = props.user.id;
  const categoryId = props.match.params.id;

  const [categoryItemsList, setCategoryItemsList] = useState([]);
  const [category, setCategory] = useState({});
  const [otherCategoryItems, setOtherCategoryItems] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [editedCategory, setEditedCategory] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showItemEditForm, setShowItemEditForm] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [editedItem, setEditedItem] = useState({});
  const [color, setColor] = useState("");
  const [pickerView, setPickerView] = useState("Twitter");

  const getUserData = async () => {
    const userData = await fetchUserData(userId);
    if (userData.name) {
      const categoryList = makeObjectAbc(userData.categories);
      const allItems = makeObjectAbc(userData.items);
      const categoryItems = allItems.filter((item) => item.categoryId === categoryId);
      const otherItems = allItems.filter((item) => item.categoryId !== categoryId);
      const selectedCategory = categoryList.find((category) => category.id === categoryId);
      const categoryColor = selectedCategory.color;
      setCategory(selectedCategory);
      setColor(categoryColor);
      setCategoryItemsList(categoryItems);
      setOtherCategoryItems(otherItems);
      return setUserRooms(makeObjectAbc(userData.rooms));
    } else {
      return userData;
    }
  };

  const itemSubmitHandler = async (event) => {
    event.preventDefault();
    editedItem.categoryId = categoryId;
    const response = await Postman.moveItem(editedItem);
    if (response.id) {
      const updatedCategoryItems = categoryItemsList.concat(response);
      const updatedOtherCategoryItems = [...otherCategoryItems];
      const updatedItemIndex = updatedOtherCategoryItems.findIndex(
        (item) => item.id === response.id
      );
      updatedOtherCategoryItems.splice(updatedItemIndex, 1);
      setCategoryItemsList(updatedCategoryItems);
      setOtherCategoryItems(updatedOtherCategoryItems);
      return setShowItemEditForm(!showItemEditForm);
    }
    if (response.error) {
      return console.error(response.error);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    editedCategory.color = color;
    if (!editedCategory.name.trim()) return setFormErrors("Please enter a name");
    const response = await Postman.editCategory(editedCategory, categoryId);
    if (response.category) {
      setCategory(response.category);
      setCategoryItemsList(response.category.items);
      setFormErrors("");
      return setShowEditForm(false);
    }
    return console.error(response.error);
  };

  const deleteHandler = async (event) => {
    event.preventDefault();
    const response = await Postman.deleteCategory(categoryId);
    response === "deleted" ? setShouldRedirect(true) : console.error(response);
  };

  const editHandler = (event) => {
    event.preventDefault();
    setEditedCategory({
      name: category.name,
      color: category.color || "",
      id: categoryId,
      userId: userId,
    });
    setShowEditForm(!showEditForm);
  };

  const changeHandler = (event) => {
    event.preventDefault();
    setEditedCategory({ ...editedCategory, [event.currentTarget.name]: event.currentTarget.value });
  };

  const itemChangeHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      ...editedItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const itemClickHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      id: "",
    });
    setShowItemEditForm(!showItemEditForm);
  };

  const onInputChange = (event) => {
    event.preventDefault();
    setSearchString(event.currentTarget.value);
  };
  const handleChange = (color, event) => {
    setColor(color.hex);
  };

  const handleTwitterClick = (event) => {
    setPickerView("Twitter");
  };
  const handleSliderClick = (event) => {
    setPickerView("Slider");
  };
  let searchedItems = categoryItemsList.filter((listItem) => {
    return (
      listItem.name.toLowerCase().startsWith(searchString) ||
      listItem.name.toUpperCase().startsWith(searchString)
    );
  });

  const searchTiles = searchedItems.map((listItem) => {
    return <ItemTile key={listItem.id} item={listItem} rooms={userRooms} />;
  });

  const otherItemsArray = createSelectors(otherCategoryItems);

  useEffect(() => {
    getUserData();
  }, []);

  if (shouldRedirect) {
    return <Redirect push to="/categories" />;
  }

  return (
    <>
      {showEditForm ? (
        <form onSubmit={submitHandler} className="name-edit-form">
          <input
            autoFocus
            className="h1-input"
            type="text"
            name="name"
            value={editedCategory.name}
            onChange={changeHandler}
          />
          <div className="formerror">{formErrors.name}</div>
          <div className="picker-links">
            <a
              onClick={handleTwitterClick}
              className={pickerView === "Twitter" ? "active" : "inactive"}
            >
              Pick a color
            </a>{" "}
            or
            <a
              className={pickerView === "Slider" ? "active" : "inactive"}
              onClick={handleSliderClick}
            >
              choose your own
            </a>
          </div>
          <div className="color-picker">
            {pickerView === "Twitter" && (
              <TwitterPicker colors={colors} onChange={handleChange} color={color} width="auto" />
            )}
            {pickerView === "Slider" && (
              <SliderPicker onChange={handleChange} color={color} width="auto" />
            )}
          </div>
          <div className="button-container">
            <input type="submit" className="button" value="Save changes" />
            <div className="button cancel" onClick={editHandler}>
              Cancel
            </div>
          </div>
          {!categoryItemsList.length && (
            <a className="delete" onClick={deleteHandler}>
              Delete category
            </a>
          )}
        </form>
      ) : (
        <h1>
          {category.name}{" "}
          <span className="edit-icon" onClick={editHandler}>
            <EditIcon />
          </span>
        </h1>
      )}

      <SearchForm placeholder={`Search within ${category.name}`} onInputChange={onInputChange} />

      <div className="search-container">{searchTiles}</div>

      <div onClick={itemClickHandler} className="circle-button-container">
        <PlusIcon iconPosition={showItemEditForm ? "x" : "plus"} />
      </div>

      {showItemEditForm && (
        <div className="form-modal">
          <h4>Move an item to {category.name}</h4>
          <form onSubmit={itemSubmitHandler}>
            <select name="id" value={editedItem.id} onChange={itemChangeHandler}>
              <option value="" disabled>
                Select an item
              </option>
              {otherItemsArray}
            </select>
            <input type="submit" className="button" value="Save change" />
          </form>
        </div>
      )}
    </>
  );
};

export default withRouter(CategoryShow);
