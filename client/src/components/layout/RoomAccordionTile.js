import React, { useState } from "react";
import { Link } from "react-router-dom";

const RoomAccordionTile = (props) => {
  const { room } = props;

  let itemCount = 0;
  if (room.items) {
    itemCount = room.items.length;
  }

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let itemsArray;
  if (room.items) {
    itemsArray = room.items.map((item) => {
      return (
        <li key={item.id}>
          {" "}
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </li>
      );
    });
  }

  return (
    <div className="room-tile wintergreen">
      <div className="top-row">
        <div className="item-count" onClick={toggle}>
          <p>{itemCount}</p>
          <div className="background"></div>
        </div>

        <Link className="name" to={`/rooms/${room.id}`}>
          <h5>{room.name}</h5>
        </Link>
      </div>
      <div className="item-content" aria-expanded={!isOpen}>
        <ul>{itemsArray}</ul>
      </div>
    </div>
  );
};

export default RoomAccordionTile;
