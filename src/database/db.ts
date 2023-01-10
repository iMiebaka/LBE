import knex from 'knex';
import configs from './knexfile';
import { Model }  from 'objection';

const config_ = configs[process.env.NODE_ENV || 'development'];

const db = knex(config_);
Model.knex(db);

export default db;
