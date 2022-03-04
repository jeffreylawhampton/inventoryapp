import React from "react";
import Dropzone from "react-dropzone";

const ItemShowEditForm = ({
  formErrors,
  roomSelectors,
  submitHandler,
  changeHandler,
  cancelHandler,
  editedItem,
  categorySelectors,
  handleImageUpload,
  fileName,
}) => {
  return (
    <form className="item-edit-form" onSubmit={submitHandler}>
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
      <label>
        {!formErrors.name && "Name"} <span className="formerror">{formErrors.name}</span>
        <input type="text" name="name" value={editedItem.name} onChange={changeHandler} />
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
