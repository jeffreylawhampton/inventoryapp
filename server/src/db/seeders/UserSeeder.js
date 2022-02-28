import { User } from "../../models/index.js";

class UserSeeder {
  static async seed() {
    const betty = await User.query().insert({ name: "Betty", email: "b@b.com", password: "b" });
    const dave = await User.query().insert({ name: "Dave", email: "d@d.com", password: "d" });
    const jim = await User.query().insert({ name: "Jim", email: "j@j.com", password: "j" });
  }
}

export default UserSeeder;
