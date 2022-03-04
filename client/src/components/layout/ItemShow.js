import React, { useState, useEffect } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";

import makeObjectAbc from "../../services/makeOjbectsAbc";
import translateServerErrors from "../../services/translateServerErrors";

import EditIcon from "./EditIcon";
import ItemShowEditForm from "./ItemShowEditForm";
import PlusIcon from "./PlusIcon";

const ItemShow = (props) => {
  const itemId = props.match.params.id;
  const { user } = props;
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [item, setItem] = useState({});
  const [editedItem, setEditedItem] = useState({});
  const [itemList, setItemList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [showEditLocationForm, setShowEditLocationForm] = useState(false);
  const [fileName, setFileName] = useState("");

  const getItem = async () => {
    try {
      const response = await fetch(`/api/v1/users/${user.id}`);
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      const itemArray = makeObjectAbc(body.user.items);
      const roomArray = makeObjectAbc(body.user.rooms);
      const selectedItem = itemArray.find((e) => e.id === itemId);
      const categoryArray = makeObjectAbc(body.user.categories);
      const currentRoom = roomArray.find((e) => e.id === selectedItem.roomId);
      if (currentRoom) {
        setCurrentLocation(currentRoom.name);
      }
      setItem(selectedItem);
      setItemList(itemArray);
      setCategoryList(categoryArray);
      setRoomList(roomArray);
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  let categorySelectors;
  if (categoryList) {
    categorySelectors = categoryList.map((category) => {
      return (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      );
    });
  }

  let roomSelectors;
  if (roomList) {
    roomSelectors = roomList.map((room) => {
      return (
        <option key={room.id} value={room.id}>
          {room.name}
        </option>
      );
    });
  }

  const deleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/v1/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        const error = new Error(errorMessage);
        throw error;
      }
      setShouldRedirect(true);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const editItem = async (editedItemData) => {
    var editedItemBody = new FormData();
    editedItemBody.append("name", editedItemData.name);
    editedItemBody.append("description", editedItemData.description);
    editedItemBody.append("roomId", editedItemData.roomId);
    editedItemBody.append("categoryId", editedItemData.categoryId);
    editedItemBody.append("userId", user.id);
    editedItemBody.append("image", editedItemData.image);

    try {
      const response = await fetch(`/api/v1/items/${itemId}`, {
        method: "PATCH",
        headers: {
          Accept: "image/jpeg",
        },
        body: editedItemBody,
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
      setItem(body.item);
      if (body.item.roomId) {
        setCurrentLocation(roomList.find((e) => e.id === body.item.roomId).name);
      }
      setFormErrors({});
    } catch (error) {
      console.error(`Error in Fetch: ${error.message}`);
    }
  };

  const editLocation = async (editedItem) => {
    try {
      const response = await fetch(`/api/v1/items/${itemId}`, {
        method: "PATCH",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(editedItem),
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
      setItem(body.item);
      setCurrentLocation(roomList.find((e) => e.id === body.item.roomId).name);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const handleImageUpload = (acceptedImage) => {
    setEditedItem({
      ...editedItem,
      image: acceptedImage[0],
    });
    setFileName(acceptedImage[0].name);
  };

  const editHandler = (event) => {
    event.preventDefault();
    setFormErrors({});
    setEditedItem({
      name: item.name,
      description: item.description || "",
      roomId: item.roomId || "",
      categoryId: item.categoryId || "",
      userId: item.userId || "",
      image: item.image || {},
    });
    setShowEditForm(!showEditForm);
  };

  const locationEditHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      name: item.name,
      roomId: item.roomId || "",
      userId: item.userId,
    });
    setShowEditLocationForm(!showEditLocationForm);
  };

  const changeHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      ...editedItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (validateInput(editedItem)) {
      editItem(editedItem);
      setShowEditForm(false);
    }
  };

  const locationSubmitHandler = (event) => {
    event.preventDefault();
    editLocation(editedItem);
    setShowEditLocationForm(false);
  };

  const deleteHandler = (event) => {
    event.preventDefault();
    deleteItem(itemId);
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    setShowEditForm(false);
  };
  const validateInput = (editedItem) => {
    let newFormErrors = {};
    if (!editedItem.name.trim()) {
      newFormErrors.name = "Please enter a name";
    }

    if (newFormErrors.name || newFormErrors.category) {
      setFormErrors(newFormErrors);
      return false;
    }
    return true;
  };
  if (shouldRedirect) {
    return <Redirect push to="/items" />;
  }

  const colorClass = item.color;

  return (
    <div className="item-show-container grid-x grid-margin-x">
      <div className="item-info cell small-12 medium-6">
        <Link to={`/categories/${item.categoryId}`}>
          <h6 className="category-link">{item.category}</h6>
        </Link>
        <h1 className={`item-highlight ${colorClass}`}>{item.name}</h1>
        {!showEditForm && (
          <p className="location">
            <strong>Current location:</strong>
            <br />
            {!currentLocation && <>The void of space</>}
            {currentLocation && currentLocation} <a onClick={locationEditHandler}>Move</a>
          </p>
        )}

        {showEditLocationForm && (
          <div className="location-form">
            <form onSubmit={locationSubmitHandler}>
              <label>
                Room
                <select name="roomId" value={editedItem.roomId} onChange={changeHandler}>
                  <option value="" className="disabled" disabled>
                    Pick a room, any room
                  </option>
                  {roomSelectors}
                </select>
              </label>
              <div className="button-group">
                <input type="submit" value="Move it!" className="button" />
                <div className="button cancel" onClick={locationEditHandler}>
                  Cancel
                </div>
              </div>
            </form>
          </div>
        )}

        <div onClick={editHandler} className="circle-button-container">
          {showEditForm ? <PlusIcon iconPosition="x" /> : <EditIcon />}
        </div>
        {showEditForm ? (
          <>
            <div className="edit-links marg0">
              <a onClick={deleteHandler}>Delete item</a>
            </div>
            <ItemShowEditForm
              user={user}
              roomSelectors={roomSelectors}
              submitHandler={submitHandler}
              changeHandler={changeHandler}
              cancelHandler={cancelHandler}
              editedItem={editedItem}
              formErrors={formErrors}
              categorySelectors={categorySelectors}
              handleImageUpload={handleImageUpload}
              fileName={fileName}
            />
          </>
        ) : (
          <p>{item.description}</p>
        )}
      </div>
      <div className="item-image cell small-12 medium-6">
        <img src={item.image} />
      </div>
    </div>
  );
};

export default withRouter(ItemShow);
