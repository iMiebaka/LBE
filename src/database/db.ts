import knex from 'knex';
import configs from './knexfile';
import { Model } from 'objection';
import { config, logger } from '../config';

const db = knex(configs[config.RUNTIME || 'development']);
Model.knex(db);


export default db;
