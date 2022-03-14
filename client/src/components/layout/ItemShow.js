import React, { useState, useEffect } from "react";
import { withRouter, Redirect } from "react-router-dom";

import createSelectors from "../../services/createSelectors";
import fetchUserData from "../../services/fetchUserData";
import makeObjectAbc from "../../services/makeOjbectsAbc";
import Postman from "../../services/Postman";
import Teller from "../../services/Teller";

import EditIcon from "../assets/EditIcon";
import ItemShowEditForm from "./ItemShowEditForm";

const ItemShow = (props) => {
  const itemId = props.match.params.id;
  const { user } = props;
  const userId = user.id;
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [item, setItem] = useState({});
  const [itemRoom, setItemRoom] = useState("");
  const [editedItem, setEditedItem] = useState({});
  const [userItems, setUserItems] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditLocationForm, setShowEditLocationForm] = useState(false);
  const [fileName, setFileName] = useState("");
  const [categorySelectors, setCategorySelectors] = useState([]);
  const [roomSelectors, setRoomSelectors] = useState([]);

  const getUserData = async () => {
    const userData = await fetchUserData(userId);
    setUserItems(makeObjectAbc(userData.items));
    const selectedItem = userData.items.find((item) => item.id === itemId);
    setItem(selectedItem);
    if (selectedItem.roomId) {
      setItemRoom(userData.rooms.find((room) => room.id === selectedItem.roomId).name);
    }
    setUserCategories(makeObjectAbc(userData.categories));
    setUserRooms(makeObjectAbc(userData.rooms));
  };

  const moveItem = async () => {
    const response = await Postman.moveItem(editedItem);
    if (response.roomId) {
      setItem(response);
      setItemRoom(userRooms.find((e) => e.id === response.roomId).name);
    }
    if (response.error) {
      return console.error(response.error);
    }
  };

  const handleImageUpload = (acceptedImage) => {
    setEditedItem({
      ...editedItem,
      image: acceptedImage[0],
    });
    setFileName(acceptedImage[0].name);
  };

  const editHandler = (event) => {
    event.preventDefault();
    setFormErrors({});
    setEditedItem({
      id: itemId,
      name: item.name,
      description: item.description || "",
      roomId: item.roomId || "",
      categoryId: item.categoryId || "",
      quantity: item.quantity || "",
      unitCost: item.unitCost || "",
      userId: user.id,
      image: item.image || {},
    });
    setCategorySelectors(createSelectors(userCategories));
    setRoomSelectors(createSelectors(userRooms));
    setShowEditForm(!showEditForm);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (validateInput(editedItem)) {
      const postedEdit = await Postman.editItem(editedItem, userId);
      if (postedEdit.item) {
        setItem(postedEdit.item);
        if (postedEdit.item.roomId) {
          setItemRoom(userRooms.find((e) => e.id === postedEdit.item.roomId).name);
        }
        return setShowEditForm(false);
      }
      if (postedEdit.serverErrors) {
        return setErrors(postedEdit.serverErrors);
      }
      if (postedEdit.errors) {
        return console.error(postedEdit.errors);
      }
    }
  };

  const deleteHandler = async (event) => {
    event.preventDefault();
    if (!(await Postman.deleteItem(itemId))) return setErrors();
    return setShouldRedirect(true);
  };

  const locationEditHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      id: itemId,
      name: item.name,
      roomId: item.roomId || "",
      userId: user.id,
    });
    setRoomSelectors(createSelectors(userRooms));
    setShowEditLocationForm(!showEditLocationForm);
  };

  const locationSubmitHandler = (event) => {
    event.preventDefault();
    moveItem(editedItem);
    setShowEditLocationForm(false);
  };

  const changeHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      ...editedItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    setShowEditForm(false);
  };
  const validateInput = (editedItem) => {
    let newFormErrors = {};
    if (!editedItem.name.trim()) {
      newFormErrors.name = "Please enter a name";
      setFormErrors(newFormErrors);
      return false;
    }
    return true;
  };

  const displayValue = Teller.parseTotalValue(item.quantity, item.unitCost);
  const displayCost = Teller.parseUnitCost(item.unitCost);

  useEffect(() => {
    getUserData();
  }, []);

  if (shouldRedirect) {
    return <Redirect push to="/items" />;
  }

  return (
    <>
      <div className="item-show-container grid-x grid-margin-x">
        <div className="item-info cell small-12 medium-6">
          {showEditForm ? (
            <ItemShowEditForm
              user={user}
              roomSelectors={roomSelectors}
              submitHandler={submitHandler}
              changeHandler={changeHandler}
              cancelHandler={cancelHandler}
              deleteHandler={deleteHandler}
              editedItem={editedItem}
              formErrors={formErrors}
              errors={errors}
              categorySelectors={categorySelectors}
              handleImageUpload={handleImageUpload}
              fileName={fileName}
            />
          ) : (
            <div className="headline-container">
              <h1>{item.name}</h1>
              <div className="icon-container" onClick={editHandler}>
                <EditIcon />
              </div>
            </div>
          )}

          {!showEditForm && (
            <>
              <p>{item.description}</p>
              <p className="marg0">
                <strong>Current location:</strong>
              </p>
              {!showEditLocationForm && (
                <p className="location">
                  {!itemRoom && <>The void of space</>}
                  {itemRoom && itemRoom}
                  <a className="edit-location-link" onClick={locationEditHandler}>
                    Move
                  </a>
                </p>
              )}
            </>
          )}

          {showEditLocationForm && (
            <div className="location-form">
              <form onSubmit={locationSubmitHandler}>
                <select name="roomId" value={editedItem.roomId} onChange={changeHandler}>
                  <option value="" className="disabled" disabled>
                    Pick a room, any room
                  </option>
                  {roomSelectors}
                </select>

                <div className="button-container">
                  <input type="submit" value="Move it!" className="button" />
                  <div className="button cancel" onClick={locationEditHandler}>
                    Cancel
                  </div>
                </div>
              </form>
            </div>
          )}

          {!showEditForm && (
            <>
              <p className="show-p">
                <strong>Category:</strong> {item.category}
              </p>
              {item.quantity > 1 ? (
                <p className="show-p">
                  <strong>Quantity:</strong> {item.quantity}
                </p>
              ) : (
                ""
              )}
              {item.unitCost > 0 ? (
                <p className="show-p">
                  <strong>Unit cost:</strong> {displayCost}
                </p>
              ) : (
                ""
              )}
              {item.quantity > 1 ? (
                <p className="show-p">
                  <strong>Total value:</strong> {displayValue}
                </p>
              ) : (
                ""
              )}
            </>
          )}
        </div>
        <div className="item-image cell small-12 medium-6">
          {item.image && item.image !== "[object Object]" ? (
            <img src={item.image} alt={item.name} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default withRouter(ItemShow);
