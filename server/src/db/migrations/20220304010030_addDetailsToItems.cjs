/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.alterTable("items", (table) => {
    table.bigInteger("quantity");
    table.string("unitCost");
  });
};

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.alterTable("items", (table) => {
    table.dropColumn("quantity");
    table.dropColumn("unitCost");
  });
};
