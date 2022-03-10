import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ErrorList from "./ErrorList";
import Dropzone from "react-dropzone";

import colorSelectors from "../../services/colorSelectors";
import createSelectors from "../../services/createSelectors";

const NewItemForm = ({
  errors,
  handleSubmit,
  handleInputChange,
  itemClickHandler,
  formErrors,
  newItem,
  newRoomName,
  newCategory,
  handleImageUpload,
  handleNewRoomInputChange,
  handleNewCategoryInputChange,
  fileName,
  userCategories,
  userRooms,
}) => {
  const categorySelectors = createSelectors(userCategories);
  const roomSelectors = createSelectors(userRooms);
  return (
    <>
      <div className="form-wrapper">
        <h2>Add a new item</h2>
        <ErrorList errors={errors} />
        <form onSubmit={handleSubmit} className="item-edit-form">
          <Dropzone onDrop={handleImageUpload}>
            {({ getRootProps, getInputProps }) => (
              <section className="dropzone">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p className="drop">
                    <svg id="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path d="M256 0v128h128L256 0zM224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM288.1 344.1C284.3 349.7 278.2 352 272 352s-12.28-2.344-16.97-7.031L216 305.9V408c0 13.25-10.75 24-24 24s-24-10.75-24-24V305.9l-39.03 39.03c-9.375 9.375-24.56 9.375-33.94 0s-9.375-24.56 0-33.94l80-80c9.375-9.375 24.56-9.375 33.94 0l80 80C298.3 320.4 298.3 335.6 288.1 344.1z" />
                    </svg>
                    Drag and drop your image, or click to upload
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
          <div>
            {fileName && <h6 className="file-name">You've uploaded: {fileName}</h6>}

            <label>
              {!formErrors.name && "Item name*"}
              <span className="formerror">{formErrors.name}</span>
              <input type="text" value={newItem.name} name="name" onChange={handleInputChange} />
            </label>
          </div>
          <div>
            <label>
              Description
              <input
                type="text"
                value={newItem.description}
                name="description"
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="inputgroup">
            <label>
              Quantity
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
              />
            </label>

            <label className="relative">
              Unit cost
              <input
                type="text"
                name="unitCost"
                value={newItem.unitCost}
                onChange={handleInputChange}
              />
              <div className="unit-cost-placeholder">$</div>
            </label>
          </div>

          <div className="inputgroup">
            <label>
              {!formErrors.category && "Category"}
              <span className="formerror">{formErrors.category}</span>
              <select name="categoryId" value={newItem.categoryId} onChange={handleInputChange}>
                <option value="" className="disabled" disabled>
                  Select a category
                </option>
                {categorySelectors}
                <option value="newCategory">Create new category</option>
              </select>
              {newItem.categoryId === "newCategory" && (
                <>
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleNewCategoryInputChange}
                    placeholder="New category name"
                  ></input>
                  <select
                    name="color"
                    value={newCategory.color}
                    onChange={handleNewCategoryInputChange}
                  >
                    <option value="">Pick a color</option>
                    {colorSelectors}
                  </select>
                </>
              )}
            </label>

            <label>
              Room
              <select name="roomId" value={newItem.roomId} onChange={handleInputChange}>
                <option value="" className="disabled" disabled>
                  Select a room
                </option>
                {roomSelectors}
                <option value="newRoom">Create new room</option>
              </select>
              {newItem.roomId === "newRoom" && (
                <input
                  type="text"
                  name="name"
                  value={newRoomName.name}
                  onChange={handleNewRoomInputChange}
                  placeholder="New room name"
                ></input>
              )}
            </label>
          </div>
          <div className="button-group">
            <input type="submit" value="Submit" className="button" />
            <div className="cancel button" onClick={itemClickHandler}>
              Cancel
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewItemForm;
