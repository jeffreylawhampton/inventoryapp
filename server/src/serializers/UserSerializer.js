import { User } from "../models/index.js";
import ItemSerializer from "./ItemSerializer.js";
import CategorySerializer from "./CategorySerializer.js";
import RoomSerializer from "./RoomSerializer.js";

class UserSerializer {
  static async getUserDetail(user) {
    const allowedAttributes = ["name", "email", "id"];

    let serializedUser = {};
    for (const attribute of allowedAttributes) {
      serializedUser[attribute] = user[attribute];
    }

    const categories = await user.$relatedQuery("categories");
    const items = await user.$relatedQuery("items");
    const rooms = await user.$relatedQuery("rooms");

    serializedUser.categories = await CategorySerializer.getCategoryCollectionDetails(categories);
    serializedUser.items = await ItemSerializer.getItemCollectionDetails(items);
    serializedUser.rooms = await RoomSerializer.getRoomCollectionSummary(rooms);

    return serializedUser;
  }

  static async getUserOverview(user) {
    const allowedAttributes = ["name", "email", "id"];

    let serializedUser = {};
    for (const attribute of allowedAttributes) {
      serializedUser[attribute] = user[attribute];
    }

    const categories = await user.$relatedQuery("categories");
    const items = await user.$relatedQuery("items");
    const rooms = await user.$relatedQuery("rooms");

    serializedUser.categories = await CategorySerializer.getCategoryCollectionSummary(categories);
    serializedUser.rooms = await RoomSerializer.getRoomCollectionOverview(rooms);
    serializedUser.items = await ItemSerializer.getItemCollectionDetails(items);

    return serializedUser;
  }
}

export default UserSerializer;
