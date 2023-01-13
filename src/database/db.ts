import knex from 'knex';
import configs from './knexfile';
import { Model } from 'objection';
import { config } from '../config';

const dbConfig = config.RUNTIME != "production" ? configs[config.RUNTIME || 'development'] : {
    client: config.database.DATABASE_CLIENT,
    connection: {
        host: config.database.DATABASE_HOST,
        user: config.database.DATABASE_USER,
        password: config.database.DATABASE_PASSWORD,
        database: config.database.DATABASE_NAME,
        port: config.database.DATABASE_PORT
    },
    pool: {
        min: 0,
        max: 6,
    },
    debug: false,
    migrations: {
        tableName: "knex_migrations"
    }
}

const db = knex(dbConfig);
Model.knex(db);


export default db;
