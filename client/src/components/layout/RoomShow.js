import React, { useState, useEffect } from "react";
import { withRouter, Link, Redirect } from "react-router-dom";

import createSelectors from "../../services/createSelectors";
import fetchUserData from "../../services/fetchUserData";
import makeObjectAbc from "../../services/makeOjbectsAbc";
import Postman from "../../services/Postman";

import EditIcon from "../assets/EditIcon";
import ItemTile from "./ItemTile";
import PlusIcon from "./PlusIcon";
import SearchForm from "./SearchForm";

const RoomShow = (props) => {
  const { user } = props;
  const userId = user.id;
  const roomId = props.match.params.id;

  const [roomItemsList, setRoomItemsList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [room, setRoom] = useState({});
  const [otherRoomItems, setOtherRoomItems] = useState([]);
  const [editedRoom, setEditedRoom] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [formErrors, setFormErrors] = useState("");
  const [showItemEditForm, setShowItemEditForm] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [editedItem, setEditedItem] = useState({
    name: "",
    roomId: "",
  });
  const [searchString, setSearchString] = useState("");

  const getUserData = async () => {
    const userData = await fetchUserData(userId);
    if (userData.name) {
      const allItems = userData.items;
      const allRooms = userData.rooms;
      setRoomsList(allRooms);
      setRoom(allRooms.find((room) => room.id === roomId));
      setRoomItemsList(makeObjectAbc(allItems.filter((item) => item.roomId === roomId)));
      return setOtherRoomItems(makeObjectAbc(allItems.filter((item) => item.roomId !== roomId)));
    } else {
      return userData;
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

  const deleteHandler = async (event) => {
    event.preventDefault();
    const response = await Postman.deleteRoom(roomId);
    response === "deleted" ? setShouldRedirect(true) : console.error(response);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!editedRoom.name.trim()) return setFormErrors("Please enter a name");
    const response = await Postman.editRoom(editedRoom, roomId);
    if (response.room) {
      setRoom(response.room);
      setFormErrors("");
      return setShowEditForm(false);
    }
    return console.error(response.error);
  };

  const itemSubmitHandler = async (event) => {
    event.preventDefault();
    editedItem.roomId = roomId;
    const response = await Postman.moveItem(editedItem);
    if (response.roomId) {
      setRoomItemsList([...roomItemsList, response]);
      const updatedOtherRoomItems = otherRoomItems.map((item) => item);
      const updatedItemIndex = updatedOtherRoomItems.findIndex((item) => item.id === response.id);
      updatedOtherRoomItems.splice(updatedItemIndex, 1);
      setOtherRoomItems(updatedOtherRoomItems);
      return setShowItemEditForm(!showItemEditForm);
    }
    if (response.error) {
      return console.error(response.error);
    }
  };

  const editHandler = (event) => {
    event.preventDefault();
    setFormErrors("");
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

  useEffect(() => {
    getUserData();
  }, []);

  let roomItemArray;

  let subhead;
  if (roomItemsList) {
    roomItemArray = roomItemsList.map((item) => {
      return <ItemTile key={item.id} item={item} room={room} rooms={roomsList} />;
    });
  }

  const onInputChange = (event) => {
    event.preventDefault();
    setSearchString(event.currentTarget.value);
  };

  let searchedItems = roomItemsList.filter((listItem) => {
    return (
      listItem.name.toLowerCase().startsWith(searchString) ||
      listItem.name.toUpperCase().startsWith(searchString)
    );
  });

  const searchTiles = searchedItems.map((listItem) => {
    return <ItemTile key={listItem.id} item={listItem} rooms={roomsList} />;
  });

  const otherItemsArray = createSelectors(otherRoomItems);

  if (shouldRedirect) {
    return <Redirect push to="/rooms" />;
  }

  return (
    <div className="item-list-container">
      {showEditForm ? (
        <form onSubmit={submitHandler} className="name-edit-form">
          <span className="formerror">{formErrors}</span>
          <input
            autoFocus
            className="h1-input"
            type="text"
            name="name"
            value={editedRoom.name}
            onChange={changeHandler}
          />

          <div className="button-container">
            <input type="submit" className="button" value="Save changes" />
            <div className="button cancel" onClick={editHandler}>
              Cancel
            </div>
          </div>
          {!roomItemsList.length && (
            <a className="delete" onClick={deleteHandler}>
              Delete room
            </a>
          )}
        </form>
      ) : (
        <div className="headline-container">
          <h1>{room.name}</h1>
          <div className="icon-container" onClick={editHandler}>
            <EditIcon />
          </div>
        </div>
      )}

      {!showItemEditForm && subhead}
      {roomItemsList.length ? (
        <>
          <SearchForm placeholder={`Search within ${room.name}`} onInputChange={onInputChange} />
          <div className="search-container">{searchTiles}</div>
        </>
      ) : (
        <h4>
          Such emptiness inside me. <a onClick={itemClickHandler}>Add an item.</a>
        </h4>
      )}
      <div onClick={itemClickHandler} className="circle-button-container">
        <PlusIcon iconPosition={showItemEditForm ? "x" : "plus"} />
      </div>
      {showItemEditForm && (
        <div className="form-modal">
          <h3>Move an item to {room.name.toLowerCase()}</h3>
          <form onSubmit={itemSubmitHandler}>
            <span className="formerror">{formErrors.name}</span>
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
