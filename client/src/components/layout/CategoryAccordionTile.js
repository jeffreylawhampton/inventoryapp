import React, { useState } from "react";
import { Link } from "react-router-dom";

const CategoryAccordionTile = (props) => {
  const { category } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let colorClass = "gray";
  if (category.color) {
    colorClass = category.color;
  }

  let itemCount = 0;
  if (category.items) {
    itemCount = category.items.length;
  }

  let itemsArray;
  if (category.items) {
    itemsArray = category.items.map((item) => {
      return (
        <li key={item.id}>
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </li>
      );
    });
  }

  return (
    <div className={`room-tile ${colorClass}`}>
      <div className="top-row">
        <div className="category item-count" onClick={toggle}>
          <p>{itemCount}</p>
          <div className="background"></div>
        </div>

        <Link className="name" to={`/categories/${category.id}`}>
          <h5>{category.name}</h5>
        </Link>
      </div>
      <div className="item-content" aria-expanded={!isOpen}>
        <ul>{itemsArray}</ul>
      </div>
    </div>
  );
};

export default CategoryAccordionTile;
