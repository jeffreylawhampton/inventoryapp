import React from "react";
import { Link } from "react-router-dom";

const ItemTile = ({ item, room }) => {
  let colorClass;
  if (item.color) {
    colorClass = item.color;
  } else {
    colorClass = "gray";
  }

  return (
    <Link to={`/items/${item.id}`}>
      <div className={`item search-tile ${colorClass}`}>
        <div className="name">
          <h5>{item.name}</h5>
        </div>
        <div className="item-location">
          <h5>{room.name}</h5>
        </div>
      </div>
    </Link>
  );
};

export default ItemTile;
