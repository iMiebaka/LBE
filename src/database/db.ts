import knex from 'knex';
import configs from './knexfile';
import { Model } from 'objection';
import { config, logger } from '../config';

const NAMESPACE = "Database"

const config_ = configs[process.env.NODE_ENV || 'development'];

const db = knex(config_);
Model.knex(db);


db.raw(`CREATE DATABASE IF NOT EXISTS ${config.database.DATABASE_NAME}`)
    .then(() => {
        console.log(NAMESPACE, `Database ${config.database.DATABASE_NAME} created or already exists.`);
    })
    .catch((err) => {
        logger.error(NAMESPACE, `Error creating main database: ${err}`);
        throw err;
    });

db.raw(`CREATE DATABASE IF NOT EXISTS ${config.database.DATABASE_NAME}_TEST`)
    .then(() => {
        console.log(`Database ${config.database.DATABASE_NAME} created or already exists.`);
    })
    .catch((err) => {
        logger.error(NAMESPACE, `Error creating test database: ${err}`);
        throw err;
    });

    
export default db;
