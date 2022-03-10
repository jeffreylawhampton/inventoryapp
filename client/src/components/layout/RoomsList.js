import React, { useState, useEffect } from "react";

import fetchUserData from "../../services/fetchUserData.js";
import makeObjectAbc from "../../services/makeOjbectsAbc.js";
import Postman from "../../services/Postman.js";

import AccordionTile from "./AccordionTile";
import PlusIcon from "./PlusIcon";
import SearchForm from "./SearchForm";

const RoomsList = (props) => {
  const { user } = props;
  const userId = user.id;
  const [formErrors, setFormErrors] = useState([]);
  const [errors, setErrors] = useState({});
  const [roomsList, setRoomsList] = useState([]);
  const [newRoom, setNewRoom] = useState({});
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [searchString, setSearchString] = useState("");

  const getUserData = async () => {
    const userData = await fetchUserData(userId);
    if (userData.rooms) {
      const itemData = userData.items;
      const filteredRooms = userData.rooms.map((room) => {
        room.items = itemData.filter((item) => item.roomId === room.id);
        return room;
      });
      return setRoomsList(makeObjectAbc(filteredRooms));
    }
    return userData;
  };

  const postRoom = async (newRoomData) => {
    const response = await Postman.postRoom(newRoomData);
    if (response.room) {
      const newRoomsList = makeObjectAbc([...roomsList, response.room]);
      setErrors([]);
      setShowNewRoomForm(!showNewRoomForm);
      return setRoomsList(newRoomsList);
    }
    if (response.serverErrors) {
      return setErrors(response.serverErrors);
    }
    if (response.errors) {
      console.error(response.errors);
    }
  };

  const roomClickHandler = (event) => {
    event.preventDefault();
    clearForm();
    setShowNewRoomForm(!showNewRoomForm);
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setSearchString(event.currentTarget.value);
  };

  const handleRoomInputChange = (event) => {
    event.preventDefault();
    setNewRoom({
      ...newRoom,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateInput(newRoom)) {
      postRoom(newRoom);
      clearForm();
    }
  };

  const validateInput = (newRoom) => {
    let newFormErrors = {};
    if (!newRoom.name.trim()) {
      newFormErrors.name = "Please enter a name";
    }

    if (roomsList.find((room) => room.name === newRoom.name)) {
      newFormErrors.name = "You already have that, doofus.";
    }

    if (newFormErrors.name) {
      setFormErrors(newFormErrors);
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setNewRoom({
      name: "",
      userId: user.id,
    });
  };

  let searchedItems = roomsList.filter((room) => {
    return room.name.toLowerCase().startsWith(searchString.toLowerCase());
  });

  const searchTiles = searchedItems.map((cardObject) => {
    return (
      <AccordionTile
        key={cardObject.id}
        cardObject={cardObject}
        parentLink="rooms"
        colorClass="wintergreen"
      />
    );
  });

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className="item-list-container">
      <h1>My rooms</h1>
      <SearchForm
        searchString={searchString}
        onInputChange={handleInputChange}
        placeholder="Find a room"
      />
      <div className="search-container">{searchTiles}</div>

      <div onClick={roomClickHandler} className="circle-button-container">
        <PlusIcon iconPosition={showNewRoomForm ? "x" : "plus"} />
      </div>
      {showNewRoomForm && (
        <div className="form-modal">
          <h3>Add a new room</h3>
          <form onSubmit={handleSubmit}>
            <span className="formerror">{formErrors.name}</span>
            <label>
              Room name
              <input
                type="text"
                value={newRoom.name}
                name="name"
                onChange={handleRoomInputChange}
              />
            </label>

            <div className="button-group">
              <input type="submit" value="Submit" className="button" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoomsList;
