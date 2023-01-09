import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('process_transaction', function (table) {
        table.uuid('id').primary().notNullable().unique();
        table.string('status').notNullable();
        table.integer('otp').notNullable();
        table.string('receiver').notNullable();
        table.uuid('receiver_id').references('id').inTable('users').nullable();
        table.uuid('user_id').references('id').inTable('users');
        table.timestamps(true, true)
    });
}


export async function down(knex: Knex): Promise<void> {
}

