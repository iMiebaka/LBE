"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const configs = {
    development: {
        client: config_1.config.database.DATABASE_CLIENT,
        connection: {
            host: config_1.config.database.DATABASE_HOST,
            user: config_1.config.database.DATABASE_USER,
            password: config_1.config.database.DATABASE_PASSWORD,
            database: config_1.config.database.DATABASE_NAME,
            port: config_1.config.database.DATABASE_PORT
        },
        pool: {
            min: 0,
            max: 6,
        },
        debug: true,
        migrations: {
            tableName: "knex_migrations"
        }
    },
    test: {
        client: config_1.config.database.DATABASE_CLIENT,
        connection: {
            host: config_1.config.database.DATABASE_HOST,
            user: config_1.config.database.DATABASE_USER,
            password: config_1.config.database.DATABASE_PASSWORD,
            database: config_1.config.database.DATABASE_NAME,
            port: config_1.config.database.DATABASE_PORT
        },
        pool: {
            min: 0,
            max: 6,
        },
        debug: true,
        migrations: {
            tableName: "knex_migrations"
        }
    },
    staging: {
        client: "sqlite3",
        connection: {
            filename: "./dev.sqlite3"
        }
    },
    production: {
        connection: {
            host: config_1.config.database.DATABASE_HOST,
            user: config_1.config.database.DATABASE_USER,
            password: config_1.config.database.DATABASE_PASSWORD,
            database: config_1.config.database.DATABASE_NAME,
            port: config_1.config.database.DATABASE_PORT
        },
        pool: {
            min: 0,
            max: 6,
        },
        debug: true,
        migrations: {
            tableName: "knex_migrations"
        }
    }
};
exports.default = configs;
