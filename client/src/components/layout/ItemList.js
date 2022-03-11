import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import fetchUserData from "../../services/fetchUserData.js";
import findExistingElement from "../../services/findExistingElement.js";
import makeObjectAbc from "../../services/makeOjbectsAbc.js";
import Postman from "../../services/Postman.js";

import ItemTile from "./ItemTile";
import NewItemForm from "./NewItemForm";
import PlusIcon from "./PlusIcon";
import SearchForm from "./SearchForm";

const ItemList = ({ user }) => {
  let userId = user.id;
  const defaultItemData = {
    name: "",
    description: "",
    roomId: "",
    categoryId: "",
    userId: userId,
    quantity: "",
    unitCost: "",
    image: {},
  };
  const [newItem, setNewItem] = useState(defaultItemData);
  const [errors, setErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [userItems, setUserItems] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [newRoomName, setNewRoomName] = useState({
    name: "",
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "",
  });
  const [newItemId, setNewItemId] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [fileName, setFileName] = useState("");
  const [color, setColor] = useState({
    color: "#ddd",
  });

  const getUserData = async () => {
    const userData = await fetchUserData(userId);
    setUserItems(makeObjectAbc(userData.items));
    setUserCategories(makeObjectAbc(userData.categories));
    setUserRooms(makeObjectAbc(userData.rooms));
  };

  const handleImageUpload = (acceptedImage) => {
    setNewItem({
      ...newItem,
      image: acceptedImage[0],
    });
    setFileName(acceptedImage[0].name);
  };

  const handleInputChange = (event) => {
    setNewItem({
      ...newItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleColorChange = (color, event) => {
    setColor(color.hex);
  };

  const handleNewRoomInputChange = (event) => {
    setNewRoomName({
      ...newRoomName,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };
  const handleNewCategoryInputChange = (event) => {
    setNewCategory({
      ...newCategory,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newItem.roomId === "newRoom") {
      newItem.roomId = await Postman.postNewItemRoom(newRoomName);
    }
    if (newItem.categoryId === "newCategory") {
      newCategory.color = color;
      newItem.categoryId = await Postman.postNewItemCategory(newCategory);
    }
    if (validateInput(newItem)) {
      const postedItem = await Postman.postItem(newItem, userId);
      if (postedItem.item) {
        setUserItems([...userItems, postedItem.item]);
        setNewItemId(postedItem.item.id);
        setShouldRedirect(true);
        clearForm();
        return true;
      }
      if (postedItem.errorMessage) {
        return console.error(postedItem.errorMessage);
      }
      if (postedItem.errors) {
        return setErrors(postedItem.errors);
      }
    }
  };

  const validateInput = (newItem) => {
    let newFormErrors = {};
    if (!newItem.name.trim()) {
      newFormErrors.name = "Please enter a name";
    }
    let duplicate = findExistingElement("items", newItem.name, userItems);
    if (duplicate) newFormErrors.name = duplicate;

    if (newFormErrors.name) {
      setFormErrors(newFormErrors);
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setNewItem(defaultItemData);
  };

  const itemClickHandler = (event) => {
    event.preventDefault();
    setNewItem(defaultItemData);
    setFileName("");
    setFormErrors("");
    setErrors("");
    setShowNewItemForm(!showNewItemForm);
  };

  const onInputChange = (event) => {
    event.preventDefault();
    setSearchString(event.currentTarget.value);
  };

  let searchedItems = userItems.filter((userItem) => {
    return userItem.name.toLowerCase().startsWith(searchString.toLowerCase());
  });

  const searchTiles = searchedItems.map((userItem) => {
    return <ItemTile key={userItem.id} item={userItem} rooms={userRooms} />;
  });

  useEffect(() => {
    getUserData();
  }, []);

  if (shouldRedirect) {
    return <Redirect push to={`/items/${newItemId}`} />;
  }

  return (
    <div className="item-list-container">
      <h1>My items</h1>
      <SearchForm
        placeholder="Find an item"
        searchString={searchString}
        onInputChange={onInputChange}
      />
      <div className="search-container">{searchTiles}</div>

      <div onClick={itemClickHandler} className="circle-button-container">
        <PlusIcon iconPosition={showNewItemForm ? "x" : "plus"} />
      </div>
      {showNewItemForm && (
        <>
          <div className="modal-background"></div>
          <NewItemForm
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            errors={errors}
            formErrors={formErrors}
            userItems={userItems}
            itemClickHandler={itemClickHandler}
            userCategories={userCategories}
            userRooms={userRooms}
            handleImageUpload={handleImageUpload}
            newCategory={newCategory}
            newItem={newItem}
            newRoomName={newRoomName}
            handleNewRoomInputChange={handleNewRoomInputChange}
            handleNewCategoryInputChange={handleNewCategoryInputChange}
            fileName={fileName}
            handleColorChange={handleColorChange}
            color={color}
          />
        </>
      )}
    </div>
  );
};

export default ItemList;
