import knex from 'knex';
import configs from './knexfile';
import initDB from "./db"
import { config } from '../config';
import { Model }  from 'objection';

// initDB.raw(`CREATE DATABASE IF NOT EXISTS ${config.database.DATABASE_HOST}`).then(() => console.log(""))
const config_ = configs[process.env.NODE_ENV || 'development'];

const db = knex(config_);
Model.knex(db);

export default db;
