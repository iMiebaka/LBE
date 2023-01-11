import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().notNullable().unique();
        table.string('public_id').notNullable();
        table.string('first_name').notNullable();
        table.string('pin').notNullable();
        table.string('password').notNullable();
        table.string('last_name').notNullable();
        table.string('email').unique().notNullable();
        table.timestamps(true, true);
    }).createTable('statement', function (table) {
        table.uuid('id').primary().notNullable().unique();
        table.string('description').notNullable();
        table.uuid('user_id').references('id').inTable('users');
        table.timestamps(true, true)
    }).createTable('wallet', function (table) {
        table.uuid('id').primary().notNullable().unique();
        table.float('amount').notNullable();
        table.integer('account_number').notNullable();
        table.uuid('user_id').references('id').inTable('users');
        table.timestamps(true, true)
    }).createTable('hot_wire_transaction', function (table) {
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
    return knex.schema.dropTable('users').dropTable('statement').dropTable('wallet').dropTable('hot_wire_transaction')
}

