import knex from 'knex'
import dbConfig from '../database/knexfile';


/**
 * @type {Knex}
 */

let RUNTIME = "development"

const dbInit = knex(dbConfig.development)




export default dbInit;