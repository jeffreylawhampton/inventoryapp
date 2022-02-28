import { Category, Item } from "../models/index.js";
import ItemSerializer from "./ItemSerializer.js";

class CategorySerializer {
  static async getCategoryCollectionSummary(categories) {
    const allowedAttributes = ["id", "name", "color"];

    const serializedCategories = categories.map((category) => {
      let serializedCategory = {};

      for (const attribute of allowedAttributes) {
        serializedCategory[attribute] = category[attribute];
      }
      return serializedCategory;
    });
    return serializedCategories;
  }

  static async getCategoryCollectionDetails(categories) {
    return Promise.all(
      categories.map((category) => {
        return this.getCategoryDetails(category);
      })
    );
  }

  static async getCategoryDetails(category) {
    const allowedAttributes = ["id", "name", "color"];

    let serializedCategory = {};
    for (const attribute of allowedAttributes) {
      serializedCategory[attribute] = category[attribute];
    }

    const items = await category.$relatedQuery("items");
    const serializedItems = await ItemSerializer.getItemCollectionDetails(items);
    serializedCategory.items = serializedItems;
    return serializedCategory;
  }
}

export default CategorySerializer;
