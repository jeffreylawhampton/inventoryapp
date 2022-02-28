import React, { useState } from "react";
import { Link } from "react-router-dom";

const CategoryTile = ({ category }) => {
  let colorClass = "gray";
  if (category.color) {
    colorClass = category.color;
  }

  let itemCount = 0;
  if (category.items) {
    itemCount = category.items.length;
  }
  return (
    <Link to={`/categories/${category.id}`}>
      <div className={`category search-tile ${colorClass}`}>
        <div className="item-count">
          <div className="background"></div>
          {itemCount}
        </div>
        <h5>{category.name}</h5>
      </div>
    </Link>
  );
};

export default CategoryTile;
