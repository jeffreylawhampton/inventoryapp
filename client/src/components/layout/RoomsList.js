import React, { useState, useEffect } from "react";

import makeObjectAbc from "../../services/makeOjbectsAbc.js";
import translateServerErrors from "../../services/translateServerErrors";

import AccordionTile from "./AccordionTile";
import PlusIcon from "./PlusIcon";
import SearchForm from "./SearchForm";

const RoomsList = (props) => {
  const { user } = props;
  const userId = user.id;
  const [formErrors, setFormErrors] = useState([]);
  const [errors, setErrors] = useState({});
  const [roomsList, setRoomsList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [newRoom, setNewRoom] = useState({});
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [searchString, setSearchString] = useState("");

  const getRooms = async () => {
    try {
      const response = await fetch(`/api/v1/users/${userId}`);
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      const roomData = makeObjectAbc(body.user.rooms);
      const itemData = makeObjectAbc(body.user.items);

      const filteredRooms = roomData.map((room) => {
        room.items = itemData.filter((item) => item.roomId === room.id);
        return room;
      });
      setRoomsList(filteredRooms);
      setItemsList(itemData);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const postRoom = async (newRoomData) => {
    try {
      const response = await fetch(`/api/v1/rooms`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newRoomData),
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
      setErrors([]);
      const newRoomsList = roomsList.concat(body.room);
      setRoomsList(newRoomsList);

      setShowNewRoomForm(!showNewRoomForm);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

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

  let iconposition;
  showNewRoomForm ? (iconposition = "x") : (iconposition = "plus");

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
        <PlusIcon iconPosition={iconposition} />
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
