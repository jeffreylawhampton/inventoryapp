/* eslint-disable no-console */
import { connection } from "../boot.js";

import UserSeeder from "./seeders/UserSeeder.js";
import ItemSeeder from "./seeders/ItemSeeder.js";
import CategorySeeder from "./seeders/CategorySeeder.js";
import RoomSeeder from "./seeders/RoomSeeder.js";

class Seeder {
  static async seed() {
    console.log("Seeding users");
    await UserSeeder.seed();

    console.log("Seeding categories");
    await CategorySeeder.seed();

    console.log("Seeding rooms");
    await RoomSeeder.seed();

    console.log("Seeding items");
    await ItemSeeder.seed();

    console.log("Done!");
    await connection.destroy();
  }
}

export default Seeder;
