import knex from 'knex'
import dbConfig from './knexfile';


/**
 * @type {Knex}
 */

let RUNTIME = "development"

const dbInit = knex(dbConfig.development)




export default dbInit;