import { debug } from "console";
import type Knex  from "knex";

import { config } from "../config";

// Update with your config settings.
const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: config.database.DATABASE_CLIENT,
    connection: {
      host: config.database.DATABASE_HOST,
      user: config.database.DATABASE_USER,
      password: config.database.DATABASE_PASSWORD,
      database: config.database.DATABASE_NAME,
      port: parseInt(config.database.DATABASE_PORT)
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
    client: config.database.DATABASE_CLIENT,
    connection: {
      host: config.database.DATABASE_HOST,
      user: config.database.DATABASE_USER,
      password: config.database.DATABASE_PASSWORD,
      database: config.database.DATABASE_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
  },

  production: {
    client: config.database.DATABASE_CLIENT,
    connection: {
      host: config.database.DATABASE_HOST,
      user: config.database.DATABASE_USER,
      password: config.database.DATABASE_PASSWORD,
      database: config.database.DATABASE_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

};



export default dbConfig;
