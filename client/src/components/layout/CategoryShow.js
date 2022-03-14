import React, { useState, useEffect } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";

import createSelectors from "../../services/createSelectors.js";
import colors from "../assets/colors.js";
import fetchUserData from "../../services/fetchUserData.js";
import makeObjectAbc from "../../services/makeOjbectsAbc.js";
import Postman from "../../services/Postman.js";

import ColorPicker from "./ColorPicker.js";
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

          <ColorPicker color={color} onChange={handleChange} handleChange={handleChange} />

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
        <div className="headline-container">
          <h1>{category.name}</h1>
          <div className="icon-container" onClick={editHandler}>
            <EditIcon />
          </div>
        </div>
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
