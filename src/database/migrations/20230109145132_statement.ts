import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('statement', function (table) {
        table.uuid('id').primary().notNullable().unique();
        table.string('description').notNullable();
        table.uuid('user_id').references('id').inTable('users');
        table.timestamps(true, true)
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('statement')
}

