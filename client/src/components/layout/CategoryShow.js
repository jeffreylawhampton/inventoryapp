import React, { useState, useEffect } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";
import ItemTile from "./ItemTile";
import translateServerErrors from "../../services/translateServerErrors";
import makeObjectAbc from "../../services/makeOjbectsAbc.js";
import PlusIcon from "./PlusIcon";
import SearchForm from "./SearchForm";

const CategoryShow = (props) => {
  const user = props.user;
  const userId = props.user.id;
  const categoryId = props.match.params.id;

  const [categoryItemsList, setCategoryItemsList] = useState([]);
  const [category, setCategory] = useState({});
  const [otherCategoryItems, setOtherCategoryItems] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [editedCategory, setEditedCategory] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState([]);
  const [showItemEditForm, setShowItemEditForm] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [editedItem, setEditedItem] = useState({
    name: category.name,
    color: category.color,
    categoryId: category.id,
  });

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`/api/v1/users/${userId}`);
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      const categoryList = body.user.categories;
      let allItems = body.user.items;
      allItems = makeObjectAbc(allItems);
      const otherItems = allItems.filter((item) => item.categoryId !== categoryId);
      setCategory(categoryList.find((category) => category.id === categoryId));
      setCategoryItemsList(allItems.filter((item) => item.categoryId === categoryId));
      setOtherCategoryItems(allItems.filter((item) => item.categoryId !== categoryId));
      setUserRooms(body.user.rooms);
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`);
    }
  };

  const moveItem = async (editedItem) => {
    const itemId = editedItem.id;
    try {
      const response = await fetch(`/api/v1/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedItem),
      });
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      const newCategoryItem = body.item;
      const updatedCategoryItems = categoryItemsList.concat(newCategoryItem);
      const updatedOtherCategoryItems = otherCategoryItems.map((item) => item);
      const updatedItemIndex = updatedOtherCategoryItems.findIndex(
        (item) => item.id === newCategoryItem.id
      );
      updatedOtherCategoryItems.splice(updatedItemIndex, 1);
      setCategoryItemsList(updatedCategoryItems);
      setOtherCategoryItems(updatedOtherCategoryItems);
      setShowItemEditForm(!showItemEditForm);
    } catch (error) {
      console.log(`Error in fetch: ${error.message}`);
    }
  };

  const itemSubmitHandler = (event) => {
    event.preventDefault();
    editedItem.categoryId = categoryId;
    moveItem(editedItem);
  };

  const editCategory = async (editedCategory) => {
    try {
      const response = await fetch(`/api/v1/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCategory),
      });
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      setCategory(body.category);
      setCategoryItemsList(body.category.items);
    } catch (error) {
      console.log(`Error in fetch: ${error.message}`);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/v1/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        const error = new Error(errorMessage);
        throw error;
      }
      setShouldRedirect(true);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const editHandler = (event) => {
    event.preventDefault();
    setEditedCategory({
      name: category.name,
      color: category.color || "",
      id: categoryId,
      userId: userId,
    });
    setShowEditForm(!showEditForm);
  };

  const changeHandler = (event) => {
    event.preventDefault();
    setEditedCategory({ ...editedCategory, [event.currentTarget.name]: event.currentTarget.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (validateInput(editedCategory)) {
      editCategory(editedCategory);
      setShowEditForm(false);
    }
  };

  const itemChangeHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      ...editedItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const itemClickHandler = (event) => {
    event.preventDefault();
    setEditedItem({
      id: "",
    });
    setShowItemEditForm(!showItemEditForm);
  };

  const deleteHandler = (event) => {
    event.preventDefault();
    deleteCategory(categoryId);
  };

  const onInputChange = (event) => {
    event.preventDefault();
    setSearchString(event.currentTarget.value);
  };

  let searchedItems = categoryItemsList.filter((listItem) => {
    return (
      listItem.name.toLowerCase().startsWith(searchString) ||
      listItem.name.toUpperCase().startsWith(searchString)
    );
  });

  const searchTiles = searchedItems.map((listItem) => {
    return <ItemTile key={listItem.id} item={listItem} rooms={userRooms} message={"Hello"} />;
  });

  const validateInput = (editedCategory) => {
    let newFormErrors = {};
    if (!editedCategory.name.trim()) {
      newFormErrors.name = "Please enter a name";
    }
    if (newFormErrors.name) {
      setFormErrors(newFormErrors);
      return false;
    }
    return true;
  };

  let iconposition;
  let formContainerClass;
  if (showItemEditForm) {
    iconposition = "x";
    formContainerClass = "category-modal fullheight";
  } else {
    iconposition = "plus";
    formContainerClass = "category-modal hiddenheight";
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  let otherItemsArray;
  if (otherCategoryItems) {
    otherItemsArray = otherCategoryItems.map((item) => {
      return (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      );
    });
  }

  let visibleDeleteClass = "";
  if (category.items) {
    if (category.items.length) {
      visibleDeleteClass = "hidden";
    }
  }

  const colorArray = [
    "Yellow",
    "Orange",
    "Mauve",
    "Maroon",
    "Rose",
    "Red",
    "Purple",
    "Indigo",
    "Wintergreen",
    "Green",
    "Navy",
    "Blue",
  ];

  const colorSelectors = colorArray.map((color) => {
    return (
      <option value={color.toLowerCase()} key={color}>
        {color}
      </option>
    );
  });
  let categoryName;
  if (category.name) {
    categoryName = category.name.toLowerCase();
  }

  if (shouldRedirect) {
    return <Redirect push to="/categories" />;
  }

  return (
    <>
      <h1>{category.name}</h1>
      <div className="edit-links">
        <a onClick={editHandler}>Edit</a>
        <a className={visibleDeleteClass} onClick={deleteHandler}>
          Delete
        </a>
      </div>
      {showEditForm && (
        <form onSubmit={submitHandler}>
          <label>
            Name
            <input type="text" name="name" value={editedCategory.name} onChange={changeHandler} />
          </label>
          <div className="formerror">{formErrors.name}</div>
          <label>
            Color
            <select name="color" value={editedCategory.color} onChange={changeHandler}>
              <option value="" className="disabled" disabled>
                Pick a color, any color
              </option>
              {colorSelectors}
            </select>
          </label>
          <div className="button-group">
            <input type="submit" className="button" value="Save changes" />
            <div className="button cancel" onClick={editHandler}>
              Cancel
            </div>
          </div>
        </form>
      )}
      <SearchForm placeholder={`Search within ${categoryName}`} onInputChange={onInputChange} />

      <div className="search-container">{searchTiles}</div>

      <div onClick={itemClickHandler} className="circle-button-container">
        <PlusIcon iconPosition={iconposition} />
      </div>

      {showItemEditForm && (
        <div className={formContainerClass}>
          <h4>Move an item to {category.name}</h4>
          <form onSubmit={itemSubmitHandler}>
            <select name="id" value={editedItem.id} onChange={itemChangeHandler}>
              <option value="" disabled>
                Select an item
              </option>
              {otherItemsArray}
            </select>
            <input type="submit" className="button" value="Save change" />
          </form>
        </div>
      )}
    </>
  );
};

export default withRouter(CategoryShow);
