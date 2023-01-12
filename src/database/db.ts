import knex from 'knex';
import configs from './knexfile';
import { Model } from 'objection';
import { config } from '../config';


const dbConfig = configs[config.RUNTIME || 'development']
const db = knex(dbConfig);
Model.knex(db);


export default db;
