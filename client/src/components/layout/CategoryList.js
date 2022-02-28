import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import CategoryTile from "./CategoryTile";
import CategoryAccordionTile from "./CategoryAccordionTile";
import NewCategoryForm from "./NewCategoryForm";
import translateServerErrors from "../../services/translateServerErrors";
import makeObjectAbc from "../../services/makeOjbectsAbc";
import PlusIcon from "./PlusIcon";
import SearchForm from "./SearchForm";

const CategoryList = (props) => {
  const { user } = props;
  const userId = user.id;
  const [errors, setErrors] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [searchString, setSearchString] = useState("");

  const getCategories = async () => {
    try {
      const response = await fetch(`/api/v1/users/${userId}`);
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      const categoryData = makeObjectAbc(body.user.categories);
      const itemData = makeObjectAbc(body.user.items);

      const filteredCategories = categoryData.map((category) => {
        category.items = itemData.filter((item) => item.categoryId === category.id);
        return category;
      });
      setCategoryList(filteredCategories);
      setItemList(itemData);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const postCategory = async (newCategoryData) => {
    try {
      const response = await fetch(`/api/v1/categories`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newCategoryData),
      });
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json();
          const newErrors = translateServerErrors(body.errors);
          return setErrors(newErrors);
        } else {
          const errorMessage = `${response.status} (${response.statusText})`;
          const error = new Error(errorMessage);
          throw error;
        }
      }
      const body = await response.json();
      setErrors([]);
      const updatedCategoryList = categoryList.concat(body.category);
      setCategoryList(updatedCategoryList);

      setShowNewCategoryForm(!showNewCategoryForm);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const categoryClickHandler = (event) => {
    event.preventDefault();
    setShowNewCategoryForm(!showNewCategoryForm);
  };

  let iconposition;
  let formContainerClass;
  if (showNewCategoryForm) {
    iconposition = "x";
    formContainerClass = "category-modal fullheight";
  } else {
    iconposition = "plus";
    formContainerClass = "category-modal hiddenheight";
  }

  const onInputChange = (event) => {
    event.preventDefault();
    setSearchString(event.currentTarget.value);
  };

  let searchedItems = categoryList.filter((category) => {
    return category.name.toLowerCase().startsWith(searchString.toLowerCase());
  });

  const searchTiles = searchedItems.map((category) => {
    return <CategoryAccordionTile key={category.id} category={category} />;
  });

  return (
    <div className="item-list-container">
      <h1>My categories</h1>
      <SearchForm
        searchString={searchString}
        onInputChange={onInputChange}
        placeholder="Find a category"
      />
      <div className="search-container">{searchTiles}</div>

      <div onClick={categoryClickHandler} className="circle-button-container">
        <PlusIcon iconPosition={iconposition} />
      </div>
      {showNewCategoryForm && (
        <div className={formContainerClass}>
          <NewCategoryForm
            postCategory={postCategory}
            user={user}
            errors={errors}
            setErrors={setErrors}
            categories={categoryList}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryList;
