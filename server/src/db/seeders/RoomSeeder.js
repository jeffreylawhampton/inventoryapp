import { Room } from "../../models/index.js";

class RoomSeeder {
  static async seed() {
    const roomsData = [
      {
        name: "Living room",
        userId: 1,
      },
      {
        name: "Bedroom",
        userId: 1,
      },
      {
        name: "Garage",
        userId: 1,
      },
    ];

    for (const singleRoomData of roomsData) {
      const currentRoom = await Room.query().findOne(singleRoomData);
      if (!currentRoom) {
        await Room.query().insert(singleRoomData);
      }
    }
  }
}

export default RoomSeeder;
