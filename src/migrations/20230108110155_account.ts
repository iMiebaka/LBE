import * as Knex from "knex";
import Account from "../models/Account";


export async function up(knex: Knex): Promise<void> {
    knex.schema.createTable('account', function (table) {
        table.increments('id').primary();
        table.string('amount').notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('account');
}

