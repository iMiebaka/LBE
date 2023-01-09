import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function(table: Knex.TableBuilder) {
        table.uuid('id').notNullable().primary().unique();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').unique().notNullable();
        table.timestamps(true, true);
      });
      
}


export async function down(knex: Knex): Promise<void> {
}

