import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import makeObjectAbc from "../../services/makeOjbectsAbc.js";
import translateServerErrors from "../../services/translateServerErrors";

import ErrorList from "./ErrorList";
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
  const [newCategoryName, setNewCategoryName] = useState({
    name: "",
  });
  const [newItemId, setNewItemId] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [fileName, setFileName] = useState("");

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/v1/users/${userId}`);
      if (!response.ok) {
        const errorMessage = `${response.status}: (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      const items = makeObjectAbc(body.user.items);
      const categories = body.user.categories;
      const rooms = body.user.rooms;
      setUserItems(items);
      setUserCategories(categories);
      setUserRooms(rooms);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const handleImageUpload = (acceptedImage) => {
    setNewItem({
      ...newItem,
      image: acceptedImage[0],
    });
    setFileName(acceptedImage[0].name);
  };

  const postItem = async (newItemData) => {
    var newItemBody = new FormData();
    newItemBody.append("name", newItemData.name);
    newItemBody.append("description", newItemData.description);
    newItemBody.append("roomId", newItemData.roomId);
    newItemBody.append("categoryId", newItemData.categoryId);
    newItemBody.append("userId", userId);
    newItemBody.append("image", newItemData.image);

    try {
      const response = await fetch("/api/v1/items", {
        method: "POST",
        headers: {
          Accept: "image/jpeg",
        },
        body: newItemBody,
      });
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json();
          const newErrors = translateServerErrors(body.errors);
          return setErrors(newErrors);
        } else {
          throw new Error(`${response.status} (${response.statusText})`);
        }
      }
      const body = await response.json();
      setUserItems([...userItems, body.item]);
      setNewItemId(body.item.id);
      setShouldRedirect(true);
    } catch (error) {
      console.error(`Error in Fetch: ${error.message}`);
    }
  };

  const handleInputChange = (event) => {
    setNewItem({
      ...newItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleNewRoomInputChange = (event) => {
    setNewRoomName({
      ...newRoomName,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };
  const handleNewCategoryInputChange = (event) => {
    setNewCategoryName({
      ...newCategoryName,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newItem.roomId === "newRoom") {
      newItem.roomId = await postRoom(newRoomName);
    }

    if (newItem.categoryId === "newCategory") {
      newItem.categoryId = await postCategory(newCategoryName);
    }

    if (validateInput(newItem)) {
      postItem(newItem);

      clearForm();
    }
  };
  const postRoom = async (newRoomName) => {
    try {
      const response = await fetch(`/api/v1/rooms`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newRoomName),
      });
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json();
          const newErrors = translateServerErrors(body.errors);
          return setErrors(newErrors);
        } else {
          const errorMessage = `${response.status} (${response.statusText})`;
          const error = new Error(errorMessage);
          throw error;
        }
      }
      const body = await response.json();
      return body.room.id;
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };
  const postCategory = async (newCategoryName) => {
    try {
      const response = await fetch(`/api/v1/categories`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newCategoryName),
      });
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json();
          const newErrors = translateServerErrors(body.errors);
          return setErrors(newErrors);
        } else {
          const errorMessage = `${response.status} (${response.statusText})`;
          const error = new Error(errorMessage);
          throw error;
        }
      }
      const body = await response.json();
      return body.category.id;
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const validateInput = (newItem) => {
    let newFormErrors = {};
    if (!newItem.name.trim()) {
      newFormErrors.name = "Please enter a name";
    }
    if (userItems.some((e) => e.name === newItem.name)) {
      const existingItem = userItems.find((item) => item.name === newItem.name);
      let existingItemLink = (
        <Link to={`/items/${existingItem.id}`}>
          You already have that <u>here</u>
        </Link>
      );
      newFormErrors.name = existingItemLink;
    }

    if (newFormErrors.name || newFormErrors.category) {
      setFormErrors(newFormErrors);
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setNewItem(defaultItemData);
  };

  const categorySelectors = userCategories.map((category) => {
    return (
      <option value={category.id} key={category.id}>
        {category.name}
      </option>
    );
  });

  const roomSelectors = userRooms.map((room) => {
    return (
      <option value={room.id} key={room.id}>
        {room.name}
      </option>
    );
  });

  useEffect(() => {
    fetchItems();
  }, []);

  let iconposition;
  let formContainerClass = "modal";
  if (showNewItemForm) {
    iconposition = "x";
    formContainerClass += " visible";
  } else {
    iconposition = "plus";
    formContainerClass = " hidden";
  }

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
        <PlusIcon iconPosition={iconposition} />
      </div>
      {showNewItemForm && (
        <>
          <div className={formContainerClass}></div>
          <NewItemForm
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            roomSelectors={roomSelectors}
            categorySelectors={categorySelectors}
            errors={errors}
            formErrors={formErrors}
            userItems={userItems}
            itemClickHandler={itemClickHandler}
            newItem={newItem}
            handleImageUpload={handleImageUpload}
            newRoomName={newRoomName}
            newCategoryName={newCategoryName}
            handleNewRoomInputChange={handleNewRoomInputChange}
            handleNewCategoryInputChange={handleNewCategoryInputChange}
            fileName={fileName}
            setFileName={setFileName}
          />
        </>
      )}
    </div>
  );
};

export default ItemList;
