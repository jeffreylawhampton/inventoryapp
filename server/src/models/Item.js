const Model = require("./Model");

class Item extends Model {
  static get tableName() {
    return "items";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "userId"],
      properties: {
        name: {
          type: "string",
          minLength: 1,
          maxLength: 80,
        },
        userId: {
          type: ["integer", "string"],
        },
        categoryId: {
          type: ["integer", "string"],
        },
        roomId: {
          type: ["integer", "string"],
        },
        description: {
          type: "string",
        },
        image: {
          type: { type: "string" },
        },
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");
    const Category = require("./Category");
    const Room = require("./Room");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "items.userId",
          to: "users.id",
        },
      },
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: "items.categoryId",
          to: "categories.id",
        },
      },
      room: {
        relation: Model.BelongsToOneRelation,
        modelClass: Room,
        join: {
          from: "items.roomId",
          to: "rooms.id",
        },
      },
    };
  }
}

module.exports = Item;
