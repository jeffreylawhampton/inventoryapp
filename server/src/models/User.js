/* eslint-disable import/no-extraneous-dependencies */
const Bcrypt = require("bcrypt");
const unique = require("objection-unique");
const { useLimitInFirst } = require("./Model");
const Model = require("./Model");

const saltRounds = 10;

const uniqueFunc = unique({
  fields: ["email"],
  identifiers: ["id"],
});

class User extends uniqueFunc(Model) {
  static get tableName() {
    return "users";
  }

  set password(newPassword) {
    this.cryptedPassword = Bcrypt.hashSync(newPassword, saltRounds);
  }

  authenticate(password) {
    return Bcrypt.compareSync(password, this.cryptedPassword);
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "name"],

      properties: {
        email: { type: "string", format: "email" },
        cryptedPassword: { type: "string" },
        name: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    const Item = require("./Item");
    const Category = require("./Category");
    const Room = require("./Room");

    return {
      items: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: "users.id",
          to: "items.userId",
        },
      },
      categories: {
        relation: Model.HasManyRelation,
        modelClass: Category,
        join: {
          from: "users.id",
          to: "categories.userId",
        },
      },
      rooms: {
        relation: Model.HasManyRelation,
        modelClass: Room,
        join: {
          from: "users.id",
          to: "rooms.userId",
        },
      },
    };
  }

  $formatJson(json) {
    const serializedJson = super.$formatJson(json);

    if (serializedJson.cryptedPassword) {
      delete serializedJson.cryptedPassword;
    }

    return serializedJson;
  }
}

module.exports = User;
