import knex from 'knex';
import configs from './knexfile';
import { Model } from 'objection';
import { config, logger } from '../config';

const NAMESPACE = "Database"


const db = knex(configs[config.RUNTIME || 'development']);
Model.knex(db);


// This will create a database if it does not exist
if (config.RUNTIME == "development") {
    db.raw(`CREATE DATABASE IF NOT EXISTS ${config.database.DATABASE_NAME}`)
        .then(() => {
            logger.success(NAMESPACE, `Database ${config.database.DATABASE_NAME} created or already exists.`);
        })
        .catch((err) => {
            logger.error(NAMESPACE, `Error creating main database: ${err}`);
            throw err;
        });
    db.raw(`CREATE DATABASE IF NOT EXISTS ${config.database.DATABASE_NAME}_TEST`)
        .then(() => {
            logger.success(NAMESPACE, `Database ${config.database.DATABASE_NAME}_TEST created or already exists.`);
        })
        .catch((err) => {
            logger.error(NAMESPACE, `Error creating test database: ${err}`);
            throw err;
        });
}


export default db;
