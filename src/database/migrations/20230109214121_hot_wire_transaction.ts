import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('hot_wire_transaction', function (table) {
        table.uuid('id').primary().notNullable().unique();
        table.string('status').notNullable().defaultTo("PENDING")
        table.string('reciever').notNullable();
        table.float('amount').notNullable();
        // table.integer('otp').notNullable();
        table.uuid('reciever_id').references('id').inTable('users');
        table.uuid('user_id').references('id').inTable('users');
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('hot_wire_transaction')
}

