import React, { useState } from "react";
import { Link } from "react-router-dom";

const AccordionTile = (props) => {
  const { cardObject, parentLink, colorClass } = props;
  const [isOpen, setIsOpen] = useState(false);

  let itemCount = 0;
  cardObject.items ? (itemCount = cardObject.items.length) : 0;

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let itemsArray;
  if (cardObject.items) {
    itemsArray = cardObject.items.map((item) => {
      return (
        <li key={item.id}>
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </li>
      );
    });
  }

  return (
    <div className={`accordion-tile ${colorClass}`}>
      <div className="top-row">
        <div className="item-count" onClick={toggle}>
          <p>{itemCount}</p>
          <div className="background"></div>
        </div>

        <Link className="name" to={`/${parentLink}/${cardObject.id}`}>
          <h5>{cardObject.name}</h5>
        </Link>
      </div>
      <div className="item-content" aria-expanded={!isOpen}>
        <ul>{itemsArray}</ul>
      </div>
    </div>
  );
};

export default AccordionTile;
