import { Item } from "../models/index.js";
import ItemSerializer from "./ItemSerializer.js";

class RoomSerializer {
  static async getRoomCollectionSummary(rooms) {
    return Promise.all(
      rooms.map((room) => {
        return this.getRoomDetails(room);
      })
    );
  }

  static async getRoomDetails(room) {
    const allowedAttributes = ["id", "name"];
    let serializedRoom = {};

    for (const attribute of allowedAttributes) {
      serializedRoom[attribute] = room[attribute];
    }

    const roomItems = await room.$relatedQuery("items");
    const serializedRoomItems = await ItemSerializer.getItemCollectionDetails(roomItems);
    serializedRoom.items = serializedRoomItems;
    return serializedRoom;
  }

  static getRoomCollectionOverview(rooms) {
    const allowedAttributes = ["id", "name"];

    const serializedRooms = rooms.map((room) => {
      let serializedRoom = {};

      for (const attribute of allowedAttributes) {
        serializedRoom[attribute] = room[attribute];
      }
      return serializedRoom;
    });
    return serializedRooms;
  }
}

export default RoomSerializer;
