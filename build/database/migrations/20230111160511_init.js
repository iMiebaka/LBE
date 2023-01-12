"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
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
            table.timestamps(true, true);
        }).createTable('wallet', function (table) {
            table.uuid('id').primary().notNullable().unique();
            table.float('amount').notNullable();
            table.integer('account_number').notNullable();
            table.uuid('user_id').references('id').inTable('users');
            table.timestamps(true, true);
        }).createTable('hot_wire_transaction', function (table) {
            table.uuid('id').primary().notNullable().unique();
            table.string('status').notNullable().defaultTo("PENDING");
            table.string('reciever').notNullable();
            table.float('amount').notNullable();
            // table.integer('otp').notNullable();
            table.uuid('reciever_id').references('id').inTable('users');
            table.uuid('user_id').references('id').inTable('users');
            table.timestamps(true, true);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable('users').dropTable('statement').dropTable('wallet').dropTable('hot_wire_transaction');
    });
}
exports.down = down;
