const Model = require("./Model");

class Room extends Model {
  static get tableName() {
    return "rooms";
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
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");
    const Item = require("./Item");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "rooms.userId",
          to: "users.id",
        },
      },
      items: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: "rooms.id",
          to: "items.roomId",
        },
      },
    };
  }
}

module.exports = Room;
