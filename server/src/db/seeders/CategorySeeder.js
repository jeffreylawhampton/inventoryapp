import { Category } from "../../models/index.js";

class CategorySeeder {
  static async seed() {
    const categoriesData = [
      {
        name: "Crafts",
        userId: 1,
        color: "blue",
      },
      {
        name: "Office supplies",
        userId: 1,
        color: "red",
      },
      {
        name: "Electronics",
        userId: 1,
      },
    ];

    for (const singleCategoryData of categoriesData) {
      const currentCategory = await Category.query().findOne(singleCategoryData);
      if (!currentCategory) {
        await Category.query().insert(singleCategoryData);
      }
    }
  }
}

export default CategorySeeder;
