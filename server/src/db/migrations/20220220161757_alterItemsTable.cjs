/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.alterTable("items", (table) => {
    table.bigInteger("roomId").index().unsigned().references("rooms.id");
    table.string("description");
  });
};

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.alterTable("items", (table) => {
    table.dropColumn("roomId");
    table.dropColumn("description");
  });
};
