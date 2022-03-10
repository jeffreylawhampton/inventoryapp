import React from "react";
import Dropzone from "react-dropzone";
import ErrorList from "./ErrorList";
const ItemShowEditForm = ({
  formErrors,
  roomSelectors,
  submitHandler,
  changeHandler,
  cancelHandler,
  editedItem,
  categorySelectors,
  handleImageUpload,
  deleteHandler,
  fileName,
  errors,
}) => {
  return (
    <form className="item-edit-form" onSubmit={submitHandler}>
      <span className="formerror">{formErrors.name}</span>
      <input
        autoFocus
        className="h1-input"
        type="text"
        name="name"
        value={editedItem.name}
        onChange={changeHandler}
      />
      <div className="edit-links marg0">
        <a onClick={deleteHandler}>Delete item</a>
      </div>
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
      <div>{fileName && <h6 className="file-name">You've uploaded: {fileName}</h6>}</div>
      <ErrorList errors={errors} />
      <label>
        Description
        <input
          type="text"
          name="description"
          value={editedItem.description}
          onChange={changeHandler}
        />
      </label>
      <div className="inputgroup">
        <label>
          Quantity
          <input
            type="number"
            name="quantity"
            value={editedItem.quantity}
            onChange={changeHandler}
          />
        </label>

        <label className="relative">
          Unit cost
          <input type="text" name="unitCost" value={editedItem.unitCost} onChange={changeHandler} />
          <div className="unit-cost-placeholder">$</div>
        </label>
      </div>
      <div className="inputgroup">
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
      </div>
      <div className="button-group">
        <input type="submit" className="button" value="Save changes" />
        <input type="button" className="cancel button" onClick={cancelHandler} value="Cancel" />
      </div>
    </form>
  );
};

export default ItemShowEditForm;
