import React from "react";
import { Link } from "react-router-dom";

const ItemTile = ({ item, rooms, message, room }) => {
  const currentRoom = rooms.find((e) => e.id === item.roomId);
  let roomName;
  currentRoom ? (roomName = currentRoom.name) : (roomName = "The void of space");

  let colorClass;
  item.color ? (colorClass = item.color) : (colorClass = "gray");

  return (
    <Link to={`/items/${item.id}`}>
      <div className={`search-tile ${colorClass}`}>
        <div className="name">
          <h5>{item.name}</h5>
        </div>
        <div className="item-location">
          <h5>{roomName}</h5>
        </div>
      </div>
    </Link>
  );
};

export default ItemTile;
