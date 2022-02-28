import React, { useState, useEffect } from "react";
import translateServerErrors from "../../services/translateServerErrors";
import { Link, Redirect } from "react-router-dom";
import ErrorList from "./ErrorList";
import RoomTile from "./RoomTile";
import RoomAccordionTile from "./RoomAccordionTile";
import PlusIcon from "./PlusIcon";
import makeObjectAbc from "../../services/makeOjbectsAbc.js";

const RoomList = ({ user }) => {
  let userId = user.id;
  const defaultRoomData = {
    name: "",
    userId: userId,
  };
  const [newRoom, setNewRoom] = useState(defaultRoomData);
  const [errors, setErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [userRooms, setUserRooms] = useState([]);
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`/api/v1/rooms/`);
      if (!response.ok) {
        const errorMessage = `${response.status}: (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      const rooms = body.rooms.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      setUserRooms(rooms);
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
      } else {
        const body = await response.json();
        const updatedRooms = userRooms.concat(body.room);
        setUserRooms(makeObjectAbc(updatedRooms));
        setFormErrors({});
        setErrors([]);
        setShowNewRoomForm(false);
      }
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const handleInputChange = (event) => {
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

    if (userRooms.find((room) => room.name === newRoom.name)) {
      newFormErrors.name = "You already have that, doofus.";
    }

    if (newFormErrors.name) {
      setFormErrors(newFormErrors);
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setNewRoom(defaultRoomData);
  };

  let roomsList;
  if (userRooms) {
    roomsList = userRooms.map((roomObject) => {
      return <RoomAccordionTile key={roomObject.id} room={roomObject} />;
    });
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  let iconposition;
  let formContainerClass;
  if (showNewRoomForm) {
    iconposition = "x";
    formContainerClass = "category-modal fullheight";
  } else {
    iconposition = "plus";
    formContainerClass = "category-modal hiddenheight";
  }

  const roomClickHandler = (event) => {
    event.preventDefault();
    setShowNewRoomForm(!showNewRoomForm);
  };

  return (
    <div className="item-list-container">
      <h1>My rooms</h1>
      <div className="search-container">{roomsList}</div>

      {showNewRoomForm && (
        <div className={formContainerClass}>
          <h3>Add a new room</h3>
          <form onSubmit={handleSubmit}>
            <span className="formerror">{formErrors.name}</span>
            <label>
              Room name
              <input type="text" value={newRoom.name} name="name" onChange={handleInputChange} />
            </label>
            <span className="formerror">{formErrors.category}</span>

            <div className="button-group">
              <input type="submit" value="Submit" className="button" />
            </div>
          </form>
        </div>
      )}

      <div onClick={roomClickHandler} className="circle-button-container">
        <PlusIcon iconPosition={iconposition} />
      </div>
    </div>
  );
};

export default RoomList;
