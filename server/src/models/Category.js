const Model = require("./Model");

class Category extends Model {
  static get tableName() {
    return "categories";
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
        color: {
          type: "string",
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
          from: "categories.userId",
          to: "users.id",
        },
      },
      items: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: "categories.id",
          to: "items.categoryId",
        },
      },
    };
  }
}

module.exports = Category;
