import knex from "../database/db"

knex.schema.createTable('statement', function(table) {
  table.increments('id').primary();
  table.string('description').notNullable();
  table.integer('user_id').unsigned().references('id').inTable('users');
  table.timestamps(true, true);
});
