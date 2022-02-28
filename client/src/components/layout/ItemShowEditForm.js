import React from "react";

const ItemShowEditForm = ({
  formErrors,
  roomSelectors,
  submitHandler,
  changeHandler,
  cancelHandler,
  editedItem,
  categorySelectors,
}) => {
  return (
    <form className="item-edit-form" onSubmit={submitHandler}>
      <label>
        {!formErrors.name && "Name"} <span className="form-errors">{formErrors.name}</span>
        <input type="text" name="name" value={editedItem.name} onChange={changeHandler} />
        {formErrors.name}
      </label>
      <label>
        Description
        <input
          type="text"
          name="description"
          value={editedItem.description}
          onChange={changeHandler}
        />
      </label>
      <label>
        Category
        <select name="categoryId" value={editedItem.categoryId} onChange={changeHandler}>
          <option value="" className="disabled" disabled>
            Select a category
          </option>
          {categorySelectors}
        </select>
      </label>
      <label>
        Room
        <select name="roomId" value={editedItem.roomId} onChange={changeHandler}>
          <option value="" className="disabled" disabled>
            Pick a room
          </option>
          {roomSelectors}
        </select>
        {formErrors.categoryId}
      </label>

      <div className="button-group">
        <input type="submit" className="button" value="Save changes" />
        <input type="button" className="cancel button" onClick={cancelHandler} value="Cancel" />
      </div>
    </form>
  );
};

export default ItemShowEditForm;
