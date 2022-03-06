import { User, Item } from "../../models/index.js";

class ItemSeeder {
  static async seed() {
    const itemsData = [
      {
        name: "Beads",
        userId: 1,
        categoryId: 1,
        roomId: 2,
        description: "Blue 2mm",
        quantity: 10,
        unitCost: "4",
      },
      {
        name: "Leather",
        userId: 1,
        categoryId: 1,
        roomId: 1,
        description: "Cowhide",
        unitCost: "12.5",
        quantity: 12,
      },
      {
        name: "Feathers",
        userId: 1,
        categoryId: 1,
        roomId: 3,
        unitCost: "5.32",
      },
      {
        name: "Ink",
        userId: 1,
        categoryId: 2,
        roomId: 3,
        description: "For fountain pen",
      },
      {
        name: "Envelopes",
        userId: 1,
        categoryId: 3,
      },
      {
        name: "Macbook",
        userId: 1,
        categoryId: 3,
        roomId: 2,
      },
      {
        name: "Pixel 6",
        userId: 1,
        categoryId: 3,
        roomId: 2,
        description: "Purchased from T-Mobile",
      },
    ];

    for (const singleItemData of itemsData) {
      const currentItem = await Item.query().findOne(singleItemData);
      if (!currentItem) {
        await Item.query().insert(singleItemData);
      }
    }
  }
}

export default ItemSeeder;
