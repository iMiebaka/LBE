import knex from "../database/db"

knex.schema.createTable('users', function(table) {
  table.increments('id').primary();
  table.string('first_name').notNullable();
  table.string('last_name').notNullable();
  table.string('email').unique().notNullable();
  table.timestamps(true, true);
});

