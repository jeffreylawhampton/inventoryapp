import translateServerErrors from "./translateServerErrors.js";

class Postman {
  static async postItem(newItemData, userId) {
    var newItemBody = new FormData();
    newItemBody.append("name", newItemData.name);
    newItemBody.append("description", newItemData.description);
    newItemBody.append("roomId", newItemData.roomId);
    newItemBody.append("categoryId", newItemData.categoryId);
    newItemBody.append("quantity", newItemData.quantity);
    newItemBody.append("unitCost", newItemData.unitCost);
    newItemBody.append("userId", userId);
    newItemBody.append("image", newItemData.image);

    try {
      const response = await fetch("/api/v1/items", {
        method: "POST",
        headers: {
          Accept: "image/jpeg",
        },
        body: newItemBody,
      });
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json();
          const newErrors = translateServerErrors(body.errors);
          return {
            errors: newErrors,
          };
        } else {
          throw new Error(`${response.status} (${response.statusText})`);
        }
      }
      const body = await response.json();
      return {
        item: body.item,
      };
    } catch (error) {
      return {
        errorMessage: `Error in Fetch: ${error.message}`,
      };
    }
  }

  static async editItem(editedItemData, userId) {
    var editedItemBody = new FormData();
    editedItemBody.append("name", editedItemData.name);
    editedItemBody.append("description", editedItemData.description);
    editedItemBody.append("roomId", editedItemData.roomId);
    editedItemBody.append("categoryId", editedItemData.categoryId);
    editedItemBody.append("userId", userId);
    editedItemBody.append("quantity", editedItemData.quantity);
    editedItemBody.append("unitCost", editedItemData.unitCost);
    editedItemBody.append("image", editedItemData.image);

    try {
      const response = await fetch(`/api/v1/items/${editedItemData.id}`, {
        method: "PATCH",
        headers: {
          Accept: "image/jpeg",
        },
        body: editedItemBody,
      });
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json();
          const newErrors = translateServerErrors(body.errors);
          return {
            serverErrors: newErrors,
          };
        } else {
          throw new Error(`${response.status} (${response.statusText})`);
        }
      }
      const body = await response.json();
      return {
        item: body.item,
      };
    } catch (error) {
      return {
        errors: `Error in Fetch: ${error.message}`,
      };
    }
  }

  static async deleteItem(itemId) {
    try {
      const response = await fetch(`/api/v1/items/${itemId}`, {
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
      return true;
    } catch (error) {
      return console.error(`Error in fetch: ${error.message}`);
    }
  }

  static async moveItem(editedItem) {
    try {
      const response = await fetch(`/api/v1/items/${editedItem.id}`, {
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
      return body.item;
    } catch (error) {
      return {
        error: `Error in fetch: ${error.message}`,
      };
    }
  }

  static async postNewItemRoom(newRoomName) {
    try {
      const response = await fetch(`/api/v1/rooms`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newRoomName),
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
      return body.room.id;
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  }

  static async postNewItemCategory(newCategory) {
    try {
      const response = await fetch(`/api/v1/categories`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newCategory),
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
      return body.category.id;
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  }

  static async postCategory(newCategoryData) {
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
          return {
            responseType: "server errors",
            errors: newErrors,
          };
        } else {
          const errorMessage = `${response.status} (${response.statusText})`;
          const error = new Error(errorMessage);
          throw error;
        }
      }
      const body = await response.json();
      return {
        responseType: "success",
        errors: [],
        responseBody: body.category,
      };
    } catch (error) {
      return {
        responseType: "failure",
        errors: `Error in fetch: ${error.message}`,
      };
    }
  }

  static async postRoom(newRoomData) {
    try {
      const response = await fetch(`/api/v1/rooms`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newRoomData),
      });
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json();
          const newErrors = translateServerErrors(body.errors);
          return {
            serverErrors: newErrors,
          };
        } else {
          const errorMessage = `${response.status} (${response.statusText})`;
          const error = new Error(errorMessage);
          throw error;
        }
      }
      const body = await response.json();
      return {
        room: body.room,
      };
    } catch (error) {
      return {
        errors: `Error in fetch: ${error.message}`,
      };
    }
  }

  static async editRoom(editedRoom, roomId) {
    try {
      const response = await fetch(`/api/v1/rooms/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedRoom),
      });
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      return {
        room: body.room,
      };
    } catch (error) {
      return {
        error: `Error in fetch: ${error.message}`,
      };
    }
  }

  static async deleteRoom(roomId) {
    try {
      const response = await fetch(`/api/v1/rooms/${roomId}`, {
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
      return "deleted";
    } catch (error) {
      return `Error in fetch: ${error.message}`;
    }
  }

  static async editCategory(editedCategory, categoryId) {
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
      return {
        category: body.category,
      };
    } catch (error) {
      return {
        error: `Error in fetch: ${error.message}`,
      };
    }
  }

  static async deleteCategory(categoryId) {
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
      return "deleted";
    } catch (error) {
      return `Error in fetch: ${error.message}`;
    }
  }
}

export default Postman;
