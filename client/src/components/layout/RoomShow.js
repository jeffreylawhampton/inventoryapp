import React, { useState, useEffect } from "react";
import { withRouter, Link, Redirect } from "react-router-dom";
import RoomItemTile from "./RoomItemTile";
import ItemTile from "./ItemTile";
import PlusIcon from "./PlusIcon";
import makeObjectAbc from "../../services/makeOjbectsAbc";

const RoomShow = (props) => {
  const { user } = props;
  const userId = user.id;
  const roomId = props.match.params.id;

  const [roomItemsList, setRoomItemsList] = useState(null);
  const [roomsList, setRoomsList] = useState([]);
  const [room, setRoom] = useState({});
  const [otherRoomItems, setOtherRoomItems] = useState([]);
  const [editedRoom, setEditedRoom] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showItemEditForm, setShowItemEditForm] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [editedItem, setEditedItem] = useState({
    name: "",
    roomId: "",
  });
  const [viewItems, setViewItems] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`/api/v1/users/${userId}`);
      if (!response.ok) {
        const errorMessage = `${response.status}: (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      const roomList = body.user.rooms;
      const allItems = body.user.items;

      const otherItems = allItems.filter((item) => item.roomId !== roomId);
      setRoomsList(roomList);
      setRoom(roomList.find((room) => room.id === roomId));
      setRoomItemsList(
        allItems
          .filter((item) => item.roomId === roomId)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setOtherRoomItems(allItems.filter((item) => item.roomId !== roomId));
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const moveItem = async (editedItem) => {
    const itemId = editedItem.id;
    try {
      const response = await fetch(`/api/v1/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedItem),
      });
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      const newRoomItem = body.item;
      const updatedRoomItems = roomItemsList.concat(newRoomItem);
      const updatedOtherRoomItems = otherRoomItems.map((item) => item);
      const updatedItemIndex = updatedOtherRoomItems.findIndex(
        (item) => item.id === newRoomItem.id
      );
      updatedOtherRoomItems.splice(updatedItemIndex, 1);
      setRoomItemsList(updatedRoomItems);
      setOtherRoomItems(updatedOtherRoomItems);
      setShowItemEditForm(!showItemEditForm);
    } catch (error) {
      console.log(`Error in fetch: ${error.message}`);
    }
  };

  const itemClickHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      id: "",
    });
    setShowItemEditForm(!showItemEditForm);
  };

  const itemChangeHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      ...editedItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const deleteHandler = (event) => {
    event.preventDefault();
    deleteRoom(roomId);
  };

  const editRoom = async (editedRoom) => {
    try {
      const response = await fetch(`/api/v1/rooms/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedRoom),
      });
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      setRoom(body.room);
    } catch (error) {
      console.log(`Error in fetch: ${error.message}`);
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      const response = await fetch(`/api/v1/rooms/${roomId}`, {
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

  const handleItemClick = (event) => {
    event.preventDefault();
    setViewItems(true);
  };

  const itemSubmitHandler = (event) => {
    event.preventDefault();
    editedItem.roomId = roomId;
    moveItem(editedItem);
  };

  const editHandler = (event) => {
    event.preventDefault();
    setEditedRoom({
      name: room.name,
      id: roomId,
      userId: userId,
    });
    setShowEditForm(!showEditForm);
  };

  const changeHandler = (event) => {
    event.preventDefault();
    setEditedRoom({
      ...editedRoom,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (editedRoom.name.trim()) {
      editRoom(editedRoom);
    }
    setShowEditForm(false);
  };

  let iconposition;
  let formContainerClass;
  if (showItemEditForm) {
    iconposition = "x";
    formContainerClass = "category-modal fullheight";
  } else {
    iconposition = "plus";
    formContainerClass = "category-modal hiddenheight";
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  let roomItemArray;
  let visibleDeleteClass = "hidden";
  let subhead;
  if (roomItemsList) {
    roomItemArray = roomItemsList.map((item) => {
      return <RoomItemTile key={item.id} item={item} room={room} />;
    });
    if (!roomItemArray.length) {
      visibleDeleteClass = "";
      subhead = (
        <>
          <h4>
            Such emptiness inside me. <a onClick={itemClickHandler}>Add an item.</a>
          </h4>
        </>
      );
    }
  }

  let otherItemsArray;
  if (otherRoomItems) {
    otherItemsArray = otherRoomItems.map((item) => {
      return (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      );
    });
  }

  if (shouldRedirect) {
    return <Redirect push to="/rooms" />;
  }

  return (
    <div className="item-list-container">
      <h1 className="highlight">{room.name}</h1>
      <div className="edit-links">
        <a onClick={editHandler}>Edit</a>
        <a className={visibleDeleteClass} onClick={deleteHandler}>
          Delete
        </a>
      </div>
      {showEditForm && (
        <form onSubmit={submitHandler}>
          <input type="text" name="name" value={editedRoom.name} onChange={changeHandler} />

          <div className="formerror">{formErrors.name}</div>
          <div className="button-group">
            <input type="submit" className="button" value="Save changes" />
            <div className="button cancel" onClick={editHandler}>
              Cancel
            </div>
          </div>
        </form>
      )}
      {!showItemEditForm && subhead}

      <div className="search-container">{roomItemArray}</div>
      <div onClick={itemClickHandler} className="circle-button-container">
        <PlusIcon iconPosition={iconposition} />
      </div>
      {showItemEditForm && (
        <div className={formContainerClass}>
          <h3>Move an item to {room.name.toLowerCase()}</h3>
          <form onSubmit={itemSubmitHandler}>
            <select name="id" value={editedItem.id} onChange={itemChangeHandler}>
              <option value="" className="disabled" disabled>
                Select an item
              </option>
              {otherItemsArray}
            </select>
            <div className="button-group">
              <input type="submit" className="button" value="Save change" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default withRouter(RoomShow);
