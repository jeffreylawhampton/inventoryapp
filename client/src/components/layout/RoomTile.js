import React, { useState } from "react";
import { Link } from "react-router-dom";

const RoomTile = ({ room }) => {
  const { items } = room;
  const itemCount = items.length;

  const [itemArrayVisibility, setItemArrayVisibility] = useState(false);
  const expandItems = () => {
    setItemArrayVisibility(!itemArrayVisibility);
  };

  const mouseEnterHandler = (event) => {
    event.preventDefault();
    setItemArrayVisibility(true);
  };

  const mouseLeaveHandler = (event) => {
    event.preventDefault();
    setItemArrayVisibility(false);
  };

  const itemClickHandler = (event) => {
    event.preventDefault();
    expandItems();
  };

  let arrowClass = "angle";
  if (itemArrayVisibility) {
    arrowClass += ` down`;
  }

  let arrayClass = "";
  if (itemArrayVisibility) {
    arrayClass = "shown";
  }
  let itemArray;
  let topRowContent;
  if (itemCount) {
    itemArray = items.map((item) => {
      return (
        <div key={item.id}>
          <Link className={`${item.color}`} to={`/items/${item.id}`}>
            {item.name}
          </Link>
        </div>
      );
    });
    topRowContent = (
      <svg
        className={`${arrowClass} expand-items`}
        onClick={itemClickHandler}
        id="expand-item-arrow"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM358.6 278.6l-112 112c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25L290.8 256L201.4 166.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l112 112C364.9 239.6 368 247.8 368 256S364.9 272.4 358.6 278.6z" />
      </svg>
    );
  } else {
    topRowContent = (
      <div className="expand-items">
        <svg
          className="arrow-disabled"
          id="expand-item-arrow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM358.6 278.6l-112 112c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25L290.8 256L201.4 166.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l112 112C364.9 239.6 368 247.8 368 256S364.9 272.4 358.6 278.6z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="room-card">
      <div className="top-row">
        {topRowContent}
        <Link to={`/rooms/${room.id}`} className="item-details">
          <h4>{room.name}</h4>
        </Link>

        <h3 className={itemCount}>{itemCount}</h3>
      </div>

      <div className="bottom-row">{itemArrayVisibility && itemArray}</div>
    </div>
  );
};

export default RoomTile;
