import knex from "./init"

knex.schema.createTable('account', function(table) {
  table.increments('id').primary();
  table.string('amount').notNullable();
  table.integer('user_id').unsigned().references('id').inTable('users');
  table.timestamps(true, true);
});
