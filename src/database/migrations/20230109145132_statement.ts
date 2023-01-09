import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('statement', function (table) {
        table.increments('id').primary();
        table.string('description').notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.timestamps(true, true);
    }); u
}


export async function down(knex: Knex): Promise<void> {
}

