import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().notNullable().unique();
        table.string('public_id').notNullable();
        table.string('first_name').notNullable();
        table.string('password').notNullable();
        table.string('last_name').notNullable();
        table.string('email').unique().notNullable();
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
}

